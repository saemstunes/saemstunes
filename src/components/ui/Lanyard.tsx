
/* eslint-disable react/no-unknown-property */
'use client';
import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import * as THREE from 'three';
import './Lanyard.css';

interface LanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  artistImage?: string;
}

export default function Lanyard({ 
  position = [0, 0, 32], 
  gravity = [0, -40, 0], 
  fov = 20, 
  transparent = true,
  artistImage 
}: LanyardProps) {
  return (
    <div className="lanyard-wrapper">
      <Canvas
        camera={{ position: position, fov: fov }}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={1 / 60}>
          <Band artistImage={artistImage} />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
  artistImage?: string;
}

function Band({ maxSpeed = 50, minSpeed = 0, artistImage }: BandProps) {
  const lanyardRef = useRef<THREE.Group>(null);
  const fixed = useRef<any>(null);
  const j1 = useRef<any>(null);
  const j2 = useRef<any>(null);
  const j3 = useRef<any>(null);
  const card = useRef<any>(null);
  
  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();
  
  const segmentProps = { 
    type: 'dynamic' as const, 
    canSleep: true, 
    colliders: false as const, 
    angularDamping: 4, 
    linearDamping: 4 
  };
  
  const [dragged, drag] = useState<any>(false);
  const [hovered, hover] = useState(false);
  const [isSmall, setIsSmall] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 1024
  );

  // Rope joints connecting the segments
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.50, 0]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmall(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useFrame((state, delta) => {
    if (dragged && card.current) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ 
        x: vec.x - dragged.x, 
        y: vec.y - dragged.y, 
        z: vec.z - dragged.z 
      });
    }
    
    if (fixed.current && j1.current && j2.current && j3.current && card.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
      });
      
      // Update lanyard string visual representation
      if (lanyardRef.current) {
        const points = [
          j3.current.translation(),
          j2.current.lerped,
          j1.current.lerped,
          fixed.current.translation()
        ];
        
        // Update lanyard segments positions to follow physics
        lanyardRef.current.children.forEach((segment, index) => {
          if (index < points.length - 1) {
            const start = points[index];
            const end = points[index + 1];
            const midpoint = new THREE.Vector3().lerpVectors(start, end, 0.5);
            segment.position.copy(midpoint);
            segment.lookAt(end);
          }
        });
      }
      
      if (card.current) {
        ang.copy(card.current.angvel());
        rot.copy(card.current.rotation());
        card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
      }
    }
  });

  return (
    <>
      <group position={[0, 8, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody 
          position={[2, 0, 0]} 
          ref={card} 
          {...segmentProps} 
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => ((e.target as any).releasePointerCapture(e.pointerId), drag(false))}
            onPointerDown={(e) => (
              (e.target as any).setPointerCapture(e.pointerId), 
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())))
            )}
          >
            {/* Artist Image Card */}
            <mesh>
              <boxGeometry args={[1.6, 2.25, 0.02]} />
              <meshPhysicalMaterial 
                color="white" 
                clearcoat={1} 
                clearcoatRoughness={0.15} 
                roughness={0.1} 
                metalness={0.1}
              />
            </mesh>
            
            {/* Artist Image Plane */}
            {artistImage && (
              <mesh position={[0, 0, 0.011]}>
                <planeGeometry args={[1.4, 2.0]} />
                <meshBasicMaterial>
                  <primitive object={new THREE.TextureLoader().load(artistImage)} attach="map" />
                </meshBasicMaterial>
              </mesh>
            )}
            
            {/* Clip/Attachment */}
            <mesh position={[0, 1.0, 0.02]}>
              <cylinderGeometry args={[0.1, 0.1, 0.3]} />
              <meshPhysicalMaterial color="#444444" metalness={0.8} roughness={0.3} />
            </mesh>
          </group>
        </RigidBody>
      </group>
      
      {/* Simple Lanyard String using basic geometries */}
      <group ref={lanyardRef}>
        <mesh position={[0.25, 4, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.5]} />
          <meshBasicMaterial color="white" />
        </mesh>
        <mesh position={[0.75, 4, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.5]} />
          <meshBasicMaterial color="white" />
        </mesh>
        <mesh position={[1.25, 4, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.5]} />
          <meshBasicMaterial color="white" />
        </mesh>
      </group>
    </>
  );
}
