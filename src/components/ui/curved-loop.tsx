// components/ui/curved-loop.tsx
"use client";

import {
  useRef,
  useEffect,
  useState,
  useMemo,
  useId
} from "react";

interface CurvedLoopProps {
  marqueeText?: string;
  speed?: number;
  className?: string;
  curveAmount?: number;
  direction?: "left" | "right";
  interactive?: boolean;
  friction?: number;   // friction coefficient
  tiltFactor?: number; // how much it tilts per velocity
}

export const CurvedLoop = ({
  marqueeText = "",
  speed = 2,
  className,
  curveAmount = 400,
  direction = "left",
  interactive = true,
  friction = 0.95,     // lower = more resistance
  tiltFactor = 0.002,    // adjust for stronger/weaker tilt
}: CurvedLoopProps) => {
  const text = useMemo(() => {
    const hasTrailing = /\s|\u00A0$/.test(marqueeText);
    return (
      (hasTrailing ? marqueeText.replace(/\s+$/, "") : marqueeText) + "\u00A0"
    );
  }, [marqueeText]);

  const measureRef = useRef<SVGTextElement>(null);
  const textPathRef = useRef<SVGTextPathElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [spacing, setSpacing] = useState(0);
  const [offset, setOffset] = useState(0);
  const [tilt, setTilt] = useState(0); // rotation state
  const uid = useId();
  const pathId = `curve-${uid.replace(/:/g, "")}`;
  const pathD = `M-100,40 Q500,${40 + curveAmount} 1540,40`;

  const dragging = useRef(false);
  const lastX = useRef(0);
  const vel = useRef(0); // velocity in px/frame

  const textLength = spacing;
  const totalText = textLength
    ? Array(Math.ceil(1800 / textLength) + 2).fill(text).join("")
    : text;
  const ready = spacing > 0;

  useEffect(() => {
    if (measureRef.current)
      setSpacing(measureRef.current.getComputedTextLength());
  }, [text, className]);

  useEffect(() => {
    if (!spacing) return;
    if (textPathRef.current) {
      const initial = -spacing;
      textPathRef.current.setAttribute("startOffset", initial + "px");
      setOffset(initial);
    }
  }, [spacing]);

  useEffect(() => {
    if (!spacing || !ready) return;

    let frame = 0;
    const step = () => {
      if (textPathRef.current) {
        let currentOffset = parseFloat(
          textPathRef.current.getAttribute("startOffset") || "0"
        );

        if (dragging.current) {
          // while dragging, offset updates in pointer move
        } else {
          // apply velocity (natural movement + inertia)
          if (Math.abs(vel.current) > 0.01) {
            currentOffset += vel.current;
            vel.current *= friction; // slow down gradually
          } else {
            // fallback to base speed when fully stopped
            const baseDelta = direction === "right" ? speed : -speed;
            currentOffset += baseDelta;
          }

          const wrapPoint = spacing;
          if (currentOffset <= -wrapPoint) currentOffset += wrapPoint;
          if (currentOffset > 0) currentOffset -= wrapPoint;

          textPathRef.current.setAttribute(
            "startOffset",
            currentOffset + "px"
          );
          setOffset(currentOffset);
        }

        // update tilt based on velocity
        const targetTilt = vel.current * tiltFactor;
        setTilt((prev) => prev * 0.85 + targetTilt * 0.15); // smooth easing
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [spacing, speed, ready, direction, friction, tiltFactor]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    dragging.current = true;
    lastX.current = e.clientX;
    vel.current = 0; // reset momentum
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive || !dragging.current || !textPathRef.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    vel.current = dx; // record velocity

    let currentOffset = parseFloat(
      textPathRef.current.getAttribute("startOffset") || "0"
    );
    currentOffset += dx;

    const wrapPoint = spacing;
    if (currentOffset <= -wrapPoint) currentOffset += wrapPoint;
    if (currentOffset > 0) currentOffset -= wrapPoint;

    textPathRef.current.setAttribute("startOffset", currentOffset + "px");
    setOffset(currentOffset);

    setTilt(dx * tiltFactor); // immediate tilt during drag
  };

  const endDrag = () => {
    if (!interactive) return;
    dragging.current = false;
  };

  const cursorStyle = interactive
    ? dragging.current
      ? "grabbing"
      : "grab"
    : "auto";

  return (
    <div
      className="flex items-center justify-center w-full py-12"
      style={{
        visibility: ready ? "visible" : "hidden",
        cursor: cursorStyle,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      <svg
        className="w-full overflow-visible block select-none font-bold uppercase leading-none text-foreground"
        viewBox="0 0 1440 120"
        style={{
          aspectRatio: "100/12",
          fontSize: "6rem",
          transform: `rotate(${tilt}deg)`, // apply tilt
          transition: dragging.current ? "none" : "transform 0.2s ease-out",
        }}
      >
        <text
          ref={measureRef}
          xmlSpace="preserve"
          className="absolute opacity-0 pointer-events-none"
        >
          {text}
        </text>
        <defs>
          <path
            ref={pathRef}
            id={pathId}
            d={pathD}
            fill="none"
            stroke="transparent"
          />
        </defs>
        {ready && (
          <text fontWeight="bold" xmlSpace="preserve" className={className}>
            <textPath
              ref={textPathRef}
              href={`#${pathId}`}
              startOffset={offset + "px"}
              xmlSpace="preserve"
            >
              {totalText}
            </textPath>
          </text>
        )}
      </svg>
    </div>
  );
};
