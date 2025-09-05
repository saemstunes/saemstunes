import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { userRoleService, UserRole } from '@/services/userRoleService';

interface AdminContextType {
  isAdmin: boolean;
  isLoading: boolean;
  userRoles: UserRole[];
  checkAdminStatus: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: React.ReactNode;
}

export const AdminProvider = ({ children }: AdminProviderProps) => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);

  const checkAdminStatus = async () => {
    if (!user) {
      setIsAdmin(false);
      setUserRoles([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const [adminStatus, roles] = await Promise.all([
        userRoleService.isCurrentUserAdmin(),
        userRoleService.getCurrentUserRoles()
      ]);
      
      setIsAdmin(adminStatus);
      setUserRoles(roles);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      setUserRoles([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const value: AdminContextType = {
    isAdmin,
    isLoading,
    userRoles,
    checkAdminStatus
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};