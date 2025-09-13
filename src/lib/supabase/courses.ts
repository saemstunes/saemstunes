import { supabase } from '@/integrations/supabase/client';

export const coursesService = {
  async getCourses() {
    // Return mock data until tables are available
    return [
      {
        id: '1',
        title: 'Beginner Piano Fundamentals',
        description: 'Learn the basics of piano playing',
        level: 'beginner',
        access_level: 'free',
        enrollment_count: 150,
        average_rating: 4.5,
        duration: 120,
        created_at: new Date().toISOString(),
        instructor: { name: 'Saem', id: '1' },
        category_id: '1'
      },
      {
        id: '2', 
        title: 'Advanced Guitar Techniques',
        description: 'Master advanced guitar playing techniques',
        level: 'advanced',
        access_level: 'premium',
        enrollment_count: 75,
        average_rating: 4.8,
        duration: 180,
        created_at: new Date().toISOString(),
        instructor: { name: 'Saem', id: '1' },
        category_id: '2'
      }
    ];
  },

  async getCategories() {
    // Return mock categories until tables are available
    return [
      { id: '1', title: 'Piano', order_index: 0 },
      { id: '2', title: 'Guitar', order_index: 1 },
      { id: '3', title: 'Vocals', order_index: 2 }
    ];
  },

  async getCourseById(id: string) {
    const courses = await this.getCourses();
    return courses.find(c => c.id === id);
  },

  async searchCourses(query: string, filters: any = {}) {
    const courses = await this.getCourses();
    return courses.filter(course => {
      const matchesQuery = !query || 
        course.title.toLowerCase().includes(query.toLowerCase()) ||
        course.description.toLowerCase().includes(query.toLowerCase());
      
      const matchesCategory = !filters.category || filters.category === 'all' || 
        course.category_id === filters.category;
      
      const matchesLevel = !filters.level || filters.level === 'all' || 
        course.level === filters.level;
        
      return matchesQuery && matchesCategory && matchesLevel;
    });
  }
};