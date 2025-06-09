import { AccessLevel } from "@/lib/contentAccess";

export interface Video {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  category: string;
  instructor: string;
  level: string;
  access_level: AccessLevel;
}

export interface Artist {
  id: number;
  name: string;
  genre: string;
  bio: string;
  avatar: string;
  coverImage: string;
  albums: number;
  followers: number;
  isVerified: boolean;
}

export interface Resource {
  id: number;
  title: string;
  description: string;
  type: string;
  downloadUrl: string;
  category: string;
  thumbnail: string;
}

export interface LearningModule {
  id: number;
  title: string;
  description: string;
  lessons: number;
  duration: string;
  difficulty: string;
  thumbnail: string;
  tags: string[];
}

export const mockVideos = [
  {
    id: 1,
    title: "Introduction to Music Theory",
    description: "Learn the basics of music theory including scales, chords, and notation.",
    thumbnail: "/lovable-uploads/video1-thumb.jpg",
    duration: "12:45",
    category: "Music Theory",
    instructor: "Saem",
    level: "Beginner",
    access_level: "free" as const,
  },
  {
    id: 2,
    title: "Vocal Warm-up Exercises",
    description: "Essential vocal exercises to prepare your voice for singing.",
    thumbnail: "/lovable-uploads/video2-thumb.jpg",
    duration: "8:30",
    category: "Vocal Training",
    instructor: "Saem",
    level: "Beginner",
    access_level: "free" as const,
  },
  {
    id: 3,
    title: "Advanced Harmony Techniques",
    description: "Explore complex harmonic progressions and voice leading principles.",
    thumbnail: "/lovable-uploads/video3-thumb.jpg",
    duration: "18:20",
    category: "Music Theory",
    instructor: "Saem",
    level: "Advanced",
    access_level: "basic" as const,
  },
  {
    id: 4,
    title: "Performance Anxiety Management",
    description: "Strategies to overcome stage fright and perform with confidence.",
    thumbnail: "/lovable-uploads/video4-thumb.jpg",
    duration: "15:10",
    category: "Performance",
    instructor: "Saem",
    level: "Intermediate",
    access_level: "premium" as const,
  },
  {
    id: 5,
    title: "Songwriting Masterclass",
    description: "Learn professional songwriting techniques from melody to lyrics.",
    thumbnail: "/lovable-uploads/video5-thumb.jpg",
    duration: "25:45",
    category: "Songwriting",
    instructor: "Saem",
    level: "Advanced",
    access_level: "premium" as const,
  },
  {
    id: 6,
    title: "Music Production Fundamentals",
    description: "Introduction to digital audio workstations and recording techniques.",
    thumbnail: "/lovable-uploads/video6-thumb.jpg",
    duration: "22:15",
    category: "Production",
    instructor: "Saem",
    level: "Intermediate",
    access_level: "enterprise" as const,
  },
  {
    id: 7,
    title: "Jazz Improvisation",
    description: "Master the art of jazz improvisation with scales and chord progressions.",
    thumbnail: "/lovable-uploads/video7-thumb.jpg",
    duration: "19:30",
    category: "Jazz",
    instructor: "Saem",
    level: "Advanced",
    access_level: "enterprise" as const,
  },
  {
    id: 8,
    title: "Breathing Techniques for Singers",
    description: "Proper breathing methods to improve vocal control and stamina.",
    thumbnail: "/lovable-uploads/video8-thumb.jpg",
    duration: "14:25",
    category: "Vocal Training",
    instructor: "Saem",
    level: "Beginner",
    access_level: "auth" as const,
  },
];

export const mockArtists = [
  {
    id: 1,
    name: "Saem",
    genre: "Gospel",
    bio: "Kenyan gospel artist and music educator.",
    avatar: "/lovable-uploads/artist1-avatar.jpg",
    coverImage: "/lovable-uploads/artist1-cover.jpg",
    albums: 3,
    followers: 1234,
    isVerified: true,
  },
  {
    id: 2,
    name: "Mercy Chinwo",
    genre: "Gospel",
    bio: "Nigerian gospel singer, songwriter and actress.",
    avatar: "/lovable-uploads/artist2-avatar.jpg",
    coverImage: "/lovable-uploads/artist2-cover.jpg",
    albums: 5,
    followers: 5678,
    isVerified: true,
  },
  {
    id: 3,
    name: "Nathaniel Bassey",
    genre: "Gospel",
    bio: "Nigerian gospel artist, trumpeter, and songwriter.",
    avatar: "/lovable-uploads/artist3-avatar.jpg",
    coverImage: "/lovable-uploads/artist3-cover.jpg",
    albums: 7,
    followers: 9101,
    isVerified: true,
  },
];

export const mockResources = [
  {
    id: 1,
    title: "Music Theory Fundamentals",
    description: "A comprehensive guide to understanding music theory basics.",
    type: "PDF",
    downloadUrl: "#",
    category: "Theory",
    thumbnail: "/lovable-uploads/resource1-thumb.jpg",
  },
  {
    id: 2,
    title: "Vocal Exercise Collection",
    description: "A collection of vocal warm-ups and exercises for all skill levels.",
    type: "Audio",
    downloadUrl: "#",
    category: "Vocal",
    thumbnail: "/lovable-uploads/resource2-thumb.jpg",
  },
  {
    id: 3,
    title: "Chord Progression Cheat Sheet",
    description: "Quick reference for common chord progressions in various keys.",
    type: "PDF",
    downloadUrl: "#",
    category: "Theory",
    thumbnail: "/lovable-uploads/resource3-thumb.jpg",
  },
];

export const mockLearningModules = [
  {
    id: 1,
    title: "Music Theory Foundations",
    description: "Master the building blocks of music",
    lessons: 12,
    duration: "4 hours",
    difficulty: "Beginner",
    thumbnail: "/lovable-uploads/module1.jpg",
    tags: ["Theory", "Fundamentals"],
  },
  {
    id: 2,
    title: "Vocal Performance Mastery",
    description: "Develop your voice and stage presence",
    lessons: 8,
    duration: "3 hours",
    difficulty: "Intermediate",
    thumbnail: "/lovable-uploads/module2.jpg",
    tags: ["Vocal", "Performance"],
  },
  {
    id: 3,
    title: "Songwriting Workshop",
    description: "Learn to write compelling songs",
    lessons: 10,
    duration: "5 hours",
    difficulty: "Advanced",
    thumbnail: "/lovable-uploads/module3.jpg",
    tags: ["Songwriting", "Creativity"],
  },
];
