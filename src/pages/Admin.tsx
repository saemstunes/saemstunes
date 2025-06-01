import React from "react";
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

const Admin = () => {
  const { user, profile } = useAuth();

  return (
    <MainLayout>
      <div>
        <h1 className="text-3xl font-serif font-bold mb-6">Admin Dashboard</h1>
        
        {/* User Management Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage system users and their permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <p className="font-medium">{profile?.full_name || profile?.display_name || 'Admin User'}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <Badge>Admin</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Admin Sections (Example) */}
        <Card>
          <CardHeader>
            <CardTitle>System Statistics</CardTitle>
            <CardDescription>Overview of system performance and usage</CardDescription>
          </CardHeader>
          <CardContent>
            <p>No statistics available at this time.</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Admin;
