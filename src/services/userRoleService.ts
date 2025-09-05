import { supabase } from "@/integrations/supabase/client";

export type UserRole = 'admin' | 'tutor' | 'user';

export interface UserRoleData {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

class UserRoleService {
  async getUserRoles(userId: string): Promise<UserRole[]> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) throw error;
      return data?.map(item => item.role as UserRole) || [];
    } catch (error) {
      console.error('Error fetching user roles:', error);
      return [];
    }
  }

  async hasRole(userId: string, role: UserRole): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', userId)
        .eq('role', role)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking user role:', error);
      return false;
    }
  }

  async isAdmin(userId: string): Promise<boolean> {
    return this.hasRole(userId, 'admin');
  }

  async assignRole(userId: string, role: UserRole): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error assigning role:', error);
      return false;
    }
  }

  async removeRole(userId: string, role: UserRole): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error removing role:', error);
      return false;
    }
  }

  async getCurrentUserRoles(): Promise<UserRole[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    return this.getUserRoles(user.id);
  }

  async isCurrentUserAdmin(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    return this.isAdmin(user.id);
  }
}

export const userRoleService = new UserRoleService();