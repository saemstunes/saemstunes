// src/lib/supabase/resources.ts
import { supabase } from '@/integrations/supabase/client';
import { Resource, ResourceCategory } from '@/types/resource';

export const resourcesService = {
  // Get all resources with optional filtering
  async getResources(filters?: {
    category?: string;
    subject_category?: string;
    level?: string;
    access_level?: string;
    search?: string;
  }) {
    try {
      let query = supabase
        .from('resources')
        .select(`
          *,
          resource_categories:category_id (name, icon)
        `);
      
      if (filters?.category) {
        query = query.eq('category_id', filters.category);
      }
      
      if (filters?.subject_category && filters.subject_category !== 'all') {
        query = query.eq('subject_category', filters.subject_category);
      }
      
      if (filters?.level && filters.level !== 'all') {
        query = query.eq('level', filters.level);
      }
      
      if (filters?.access_level) {
        query = query.eq('access_level', filters.access_level);
      }
      
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching resources:', error);
        throw error;
      }
      
      // Map the data to include category_name and category_icon
      return (data || []).map((resource: any) => ({
        ...resource,
        category_name: resource.resource_categories?.name,
        category_icon: resource.resource_categories?.icon
      })) as Resource[];
    } catch (error) {
      console.error('Error in getResources:', error);
      throw error;
    }
  },
  
  // Get resource categories
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('resource_categories')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
      
      return data as ResourceCategory[];
    } catch (error) {
      console.error('Error in getCategories:', error);
      throw error;
    }
  },
  
  // Get a single resource by ID
  async getResource(id: string) {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select(`
          *,
          resource_categories:category_id (name, icon)
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching resource:', error);
        throw error;
      }
      
      // Map the data to include category_name and category_icon
      return {
        ...data,
        category_name: data.resource_categories?.name,
        category_icon: data.resource_categories?.icon
      } as Resource;
    } catch (error) {
      console.error('Error in getResource:', error);
      throw error;
    }
  },
  
  // Get related resources
  async getRelatedResources(resource: Resource, limit = 3) {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select(`
          *,
          resource_categories:category_id (name, icon)
        `)
        .eq('subject_category', resource.subject_category)
        .eq('level', resource.level)
        .neq('id', resource.id)
        .limit(limit);
      
      if (error) {
        console.error('Error fetching related resources:', error);
        throw error;
      }
      
      // Map the data to include category_name and category_icon
      return (data || []).map((res: any) => ({
        ...res,
        category_name: res.resource_categories?.name,
        category_icon: res.resource_categories?.icon
      })) as Resource[];
    } catch (error) {
      console.error('Error in getRelatedResources:', error);
      throw error;
    }
  },
  
  // Search resources
  async searchResources(query: string, filters: any = {}) {
    try {
      let supabaseQuery = supabase
        .from('resources')
        .select(`
          *,
          resource_categories:category_id (name, icon)
        `)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`);
      
      // Apply filters
      if (filters.category) {
        supabaseQuery = supabaseQuery.eq('category_id', filters.category);
      }
      
      if (filters.subject_category && filters.subject_category !== 'all') {
        supabaseQuery = supabaseQuery.eq('subject_category', filters.subject_category);
      }
      
      if (filters.level && filters.level !== 'all') {
        supabaseQuery = supabaseQuery.eq('level', filters.level);
      }
      
      const { data, error } = await supabaseQuery.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error searching resources:', error);
        throw error;
      }
      
      // Map the data to include category_name and category_icon
      return (data || []).map((resource: any) => ({
        ...resource,
        category_name: resource.resource_categories?.name,
        category_icon: resource.resource_categories?.icon
      })) as Resource[];
    } catch (error) {
      console.error('Error in searchResources:', error);
      throw error;
    }
  }
};
