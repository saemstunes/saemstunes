// services/userPreferencesService.ts
import { supabase } from '@/lib/supabaseClient';

export interface UserUIPreferences {
  id: string;
  user_id: string;
  instrument_selector_views: number;
  last_instrument_selector_shown: string | null;
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export class UserPreferencesService {
  static async getInstrumentSelectorStatus(userId: string): Promise<{
    shouldShow: boolean;
    viewCount: number;
    lastShown: string | null;
  }> {
    try {
      // Get or create user preferences
      let { data: prefs, error } = await supabase
        .from('user_ui_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        // No record exists, create one
        const { data: newPrefs, error: createError } = await supabase
          .from('user_ui_preferences')
          .insert({ user_id: userId })
          .select()
          .single();

        if (createError) throw createError;
        prefs = newPrefs;
      } else if (error) {
        throw error;
      }

      // Determine if should show based on business logic
      const shouldShow = this.shouldShowInstrumentSelector(prefs);

      return {
        shouldShow,
        viewCount: prefs.instrument_selector_views,
        lastShown: prefs.last_instrument_selector_shown
      };
    } catch (error) {
      console.error('Error getting instrument selector status:', error);
      // Fallback to sessionStorage logic
      throw error;
    }
  }

  static async markInstrumentSelectorShown(userId: string): Promise<void> {
    try {
      // First get current values
      const { data: prefs, error: fetchError } = await supabase
        .from('user_ui_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (fetchError) throw fetchError;

      // Update with incremented count
      const { error } = await supabase
        .from('user_ui_preferences')
        .upsert({
          user_id: userId,
          instrument_selector_views: (prefs?.instrument_selector_views || 0) + 1,
          last_instrument_selector_shown: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error marking instrument selector as shown:', error);
      throw error;
    }
  }

  private static shouldShowInstrumentSelector(prefs: UserUIPreferences): boolean {
    // Business logic: Show once per day, or if never shown
    if (!prefs.last_instrument_selector_shown) return true;
    
    const lastShown = new Date(prefs.last_instrument_selector_shown);
    const now = new Date();
    const hoursSinceLastShown = (now.getTime() - lastShown.getTime()) / (1000 * 60 * 60);
    
    // Show again after 24 hours (configurable)
    return hoursSinceLastShown >= 24;
  }
}
