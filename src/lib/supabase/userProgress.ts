import { supabase } from '@/integrations/supabase/client';

export const userProgressService = {
  async getUserCourseProgress(userId: string) {
    // Return mock progress until tables are available
    return [
      { course_id: '1', progress: 35, user_id: userId, last_accessed: new Date().toISOString() },
      { course_id: '2', progress: 0, user_id: userId, last_accessed: new Date().toISOString() }
    ];
  },

  async getUserResourceInteractions(userId: string) {
    // Return mock interactions until tables are available
    return [
      { 
        resource_id: 'res1', 
        user_id: userId, 
        viewed: true, 
        bookmarked: false, 
        last_accessed: new Date().toISOString() 
      }
    ];
  },

  async recordCourseAccess(userId: string, courseId: string) {
    // Mock implementation until tables are available
    console.log('Recording course access:', userId, courseId);
  },

  async recordResourceInteraction(userId: string, resourceId: string, updates: any) {
    // Mock implementation until tables are available
    console.log('Recording resource interaction:', userId, resourceId, updates);
  },

  async updateCourseProgress(userId: string, courseId: string, progress: number) {
    // Mock implementation until tables are available
    console.log('Updating course progress:', userId, courseId, progress);
  }
};