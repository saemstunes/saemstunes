// types/resource.ts
export type ResourceType = "videos" | "infographics" | "audios" | "documents";

export interface Resource {
  id: string;
  title: string;
  description: string;
  category_id: string;
  subject_category: string;
  level: "beginner" | "intermediate" | "advanced";
  is_locked: boolean;
  access_level: 'free' | 'auth' | 'basic' | 'premium' | 'professional';
  metadata: any;
  thumbnail_url: string;
  resource_url: string;
  duration?: string;
  instructor?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  // For UI purposes only (not from backend)
  category_name?: string;
  category_icon?: string;
}

export interface ResourceCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  created_at: string;
}
