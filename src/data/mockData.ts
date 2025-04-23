
// Mock data for the app

// Video content
export interface VideoContent {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string; // format: "MM:SS"
  instructor: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  tags: string[];
  isLocked: boolean;
}

export const mockVideos: VideoContent[] = [
  {
    id: "v1",
    title: "Vocal Warm-up Techniques",
    description: "Start your vocal practice with these essential warm-up exercises designed to prepare your voice without strain.",
    thumbnailUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1470&auto=format&fit=crop",
    videoUrl: "https://www.youtube.com/embed/Q5hS7eukUbQ",
    duration: "10:25",
    instructor: "Sarah Johnson",
    category: "Vocal Development",
    level: "beginner",
    tags: ["vocals", "warm-up", "technique"],
    isLocked: false,
  },
  {
    id: "v2",
    title: "Introduction to Piano Scales",
    description: "Learn the fundamental piano scales that will build your finger dexterity and music theory understanding.",
    thumbnailUrl: "https://images.unsplash.com/photo-1552422535-c45813c61732?q=80&w=1470&auto=format&fit=crop",
    videoUrl: "https://www.youtube.com/embed/rgaTLrZGlk0",
    duration: "15:40",
    instructor: "Michael Chen",
    category: "Instruments",
    level: "beginner",
    tags: ["piano", "scales", "technique"],
    isLocked: false,
  },
  {
    id: "v3",
    title: "Gospel Choir Arrangement Techniques",
    description: "Discover how to arrange songs for a gospel choir, focusing on harmonization and voice balancing.",
    thumbnailUrl: "https://images.unsplash.com/photo-1691266864343-9856da54e7a1?q=80&w=1374&auto=format&fit=crop",
    videoUrl: "https://www.youtube.com/embed/tTYFSXvvdYQ",
    duration: "22:15",
    instructor: "Lisa Wambui",
    category: "Arrangement",
    level: "intermediate",
    tags: ["gospel", "choir", "arrangement"],
    isLocked: true,
  },
  {
    id: "v4",
    title: "Advanced Guitar Fingerpicking",
    description: "Take your guitar skills to the next level with these advanced fingerpicking patterns and exercises.",
    thumbnailUrl: "https://images.unsplash.com/photo-1605020420620-20c943cc4669?q=80&w=1470&auto=format&fit=crop",
    videoUrl: "https://www.youtube.com/embed/JWSSS7tJ2wQ",
    duration: "18:30",
    instructor: "David Mutua",
    category: "Instruments",
    level: "advanced",
    tags: ["guitar", "fingerpicking", "technique"],
    isLocked: true,
  },
  {
    id: "v5",
    title: "Music Theory: Understanding Key Signatures",
    description: "A comprehensive guide to key signatures and how they function in music theory and composition.",
    thumbnailUrl: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=1470&auto=format&fit=crop",
    videoUrl: "https://www.youtube.com/embed/xLaw0Fhtksg",
    duration: "20:05",
    instructor: "Emily Ochieng",
    category: "Music Theory",
    level: "intermediate",
    tags: ["theory", "key signatures", "composition"],
    isLocked: true,
  },
  {
    id: "v6",
    title: "Kenyan Traditional Rhythms",
    description: "Explore the rich rhythmic traditions of Kenya and learn how to incorporate them into modern music.",
    thumbnailUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1470&auto=format&fit=crop",
    videoUrl: "https://www.youtube.com/embed/9ZaDt6r7POw",
    duration: "25:45",
    instructor: "James Mwangi",
    category: "Cultural Studies",
    level: "intermediate",
    tags: ["rhythms", "cultural", "traditional"],
    isLocked: true,
  },
];

// Infographics content
export interface Infographic {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  isLocked: boolean;
}

export const mockInfographics: Infographic[] = [
  {
    id: "i1",
    title: "The Circle of Fifths Explained",
    description: "A visual guide to understanding the circle of fifths and how to use it in your music theory practice.",
    imageUrl: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=1470&auto=format&fit=crop",
    category: "Music Theory",
    level: "beginner",
    isLocked: false,
  },
  {
    id: "i2",
    title: "Voice Placement Techniques",
    description: "Learn where your voice should resonate for different vocal styles and expressions.",
    imageUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1470&auto=format&fit=crop",
    category: "Vocal Development",
    level: "intermediate",
    isLocked: false,
  },
  {
    id: "i3",
    title: "Guitar Chord Progressions",
    description: "Common chord progressions for various music styles, specifically arranged for guitar players.",
    imageUrl: "https://images.unsplash.com/photo-1605020420620-20c943cc4669?q=80&w=1470&auto=format&fit=crop",
    category: "Instruments",
    level: "beginner",
    isLocked: true,
  },
  {
    id: "i4",
    title: "Piano Hand Positioning Guide",
    description: "Proper hand positions for piano playing to prevent injury and improve technique.",
    imageUrl: "https://images.unsplash.com/photo-1552422535-c45813c61732?q=80&w=1470&auto=format&fit=crop",
    category: "Instruments",
    level: "beginner",
    isLocked: true,
  },
  {
    id: "i5",
    title: "African Drumming Patterns",
    description: "Traditional drumming patterns from different African regions with notation and explanation.",
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1470&auto=format&fit=crop",
    category: "Cultural Studies",
    level: "intermediate",
    isLocked: true,
  },
  {
    id: "i6",
    title: "Song Structure Blueprint",
    description: "A comprehensive guide to various song structures used in different music genres.",
    imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1470&auto=format&fit=crop",
    category: "Composition",
    level: "intermediate",
    isLocked: true,
  },
];

// Tutors data
export interface Tutor {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  specialties: string[];
  rating: number;
  hourlyRate: number;
  availability: string[];
}

export const mockTutors: Tutor[] = [
  {
    id: "t1",
    name: "Sarah Johnson",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Sarah",
    bio: "Vocal coach with 10+ years of experience teaching contemporary and classical techniques.",
    specialties: ["Vocals", "Breathing Techniques", "Performance"],
    rating: 4.9,
    hourlyRate: 50,
    availability: ["Monday", "Wednesday", "Friday"],
  },
  {
    id: "t2",
    name: "David Mutua",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=David",
    bio: "Guitar specialist focusing on fingerstyle and African fusion techniques.",
    specialties: ["Guitar", "Composition", "African Fusion"],
    rating: 4.8,
    hourlyRate: 45,
    availability: ["Tuesday", "Thursday", "Saturday"],
  },
  {
    id: "t3",
    name: "Emily Ochieng",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Emily",
    bio: "Music theory expert and pianist with a background in music education.",
    specialties: ["Piano", "Music Theory", "Ear Training"],
    rating: 4.7,
    hourlyRate: 40,
    availability: ["Monday", "Tuesday", "Thursday"],
  },
  {
    id: "t4",
    name: "James Mwangi",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=James",
    bio: "Percussionist specializing in traditional African rhythms and modern adaptations.",
    specialties: ["Percussion", "Traditional Rhythms", "Performance"],
    rating: 4.8,
    hourlyRate: 45,
    availability: ["Wednesday", "Friday", "Saturday"],
  },
  {
    id: "t5",
    name: "Lisa Wambui",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Lisa",
    bio: "Choir director with extensive experience in gospel and contemporary Christian music.",
    specialties: ["Choir Direction", "Harmony", "Gospel Music"],
    rating: 4.9,
    hourlyRate: 55,
    availability: ["Monday", "Wednesday", "Saturday"],
  },
];

// Subscription plans
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: "month" | "quarter" | "year";
  features: string[];
  isPopular?: boolean;
}

export const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 9.99,
    interval: "month",
    features: [
      "Access to beginner lessons",
      "5 infographic downloads per month",
      "Community forum access",
      "Email support"
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 19.99,
    interval: "month",
    features: [
      "Access to all beginner and intermediate lessons",
      "Unlimited infographic downloads",
      "1 private lesson per month",
      "Community forum access",
      "Priority email support",
    ],
    isPopular: true,
  },
  {
    id: "professional",
    name: "Professional",
    price: 39.99,
    interval: "month",
    features: [
      "Access to all lessons (including advanced)",
      "Unlimited infographic downloads",
      "3 private lessons per month",
      "Community forum access",
      "Priority support",
      "Offline access to all content",
      "Certificate of completion",
    ],
  },
];

// Bookings data
export interface Booking {
  id: string;
  tutorId: string;
  studentId: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  type: "individual" | "group" | "workshop";
  location: "online" | "physical";
  notes?: string;
}

export const mockBookings: Booking[] = [
  {
    id: "b1",
    tutorId: "t1",
    studentId: "1",
    date: "2025-04-28",
    time: "14:00",
    status: "confirmed",
    type: "individual",
    location: "online",
    notes: "Focus on breathing techniques",
  },
  {
    id: "b2",
    tutorId: "t2",
    studentId: "2",
    date: "2025-04-30",
    time: "16:30",
    status: "pending",
    type: "individual",
    location: "online",
  },
  {
    id: "b3",
    tutorId: "t3",
    studentId: "1",
    date: "2025-05-05",
    time: "10:00",
    status: "confirmed",
    type: "group",
    location: "physical",
    notes: "Bring your own instrument",
  },
];
