
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Calendar, Music, Bell, BookOpen, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  type: 'event' | 'release' | 'learning' | 'community' | 'system';
}

const Notifications = () => {
  const { toast } = useToast();

  const notifications: Notification[] = [
    {
      id: '1',
      title: 'New Music Release',
      description: 'Saem just released a new single "Golden Melody". Listen now!',
      time: '10 minutes ago',
      isRead: false,
      type: 'release'
    },
    {
      id: '2',
      title: 'Upcoming Masterclass',
      description: 'Don\'t miss the Piano Masterclass with James Rodriguez this Saturday at 3 PM!',
      time: '2 hours ago',
      isRead: false,
      type: 'event'
    },
    {
      id: '3',
      title: 'New Course Added',
      description: 'A new course "Advanced Guitar Techniques" has been added to your enrolled courses.',
      time: 'Yesterday',
      isRead: true,
      type: 'learning'
    },
    {
      id: '4',
      title: 'Community Achievement',
      description: 'Sarah posted a new performance video and received 50+ likes!',
      time: '2 days ago',
      isRead: true,
      type: 'community'
    },
    {
      id: '5',
      title: 'System Update',
      description: 'We\'ve updated our platform with new features! Check out what\'s new.',
      time: '3 days ago',
      isRead: true,
      type: 'system'
    }
  ];

  const markAllAsRead = () => {
    toast({
      title: "All notifications marked as read",
      description: "You've cleared all your notifications"
    });
  };

  const getIconByType = (type: string) => {
    switch (type) {
      case 'event':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'release':
        return <Music className="h-4 w-4 text-green-500" />;
      case 'learning':
        return <BookOpen className="h-4 w-4 text-gold" />;
      case 'community':
        return <Users className="h-4 w-4 text-pink-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-proxima font-bold flex items-center gap-2">
              <Bell className="h-6 w-6 text-gold" />
              Notifications
            </h1>
            <p className="text-muted-foreground mt-1">
              Stay updated with events, releases, and more
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={markAllAsRead}
          >
            Mark all as read
          </Button>
        </div>

        <Separator />
        
        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={cn(
                  "p-4 rounded-lg border transition-colors",
                  notification.isRead ? "bg-background" : "bg-muted/20 border-gold/20"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "mt-1 p-2 rounded-full",
                    notification.isRead ? "bg-muted" : "bg-gold/10"
                  )}>
                    {getIconByType(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{notification.title}</h3>
                        <p className="text-muted-foreground text-sm">{notification.description}</p>
                      </div>
                      {!notification.isRead && (
                        <Badge variant="default" className="bg-gold text-white">New</Badge>
                      )}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                      <Button variant="link" size="sm" className="text-gold p-0 h-auto">View details</Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="bg-muted/30 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">No new notifications</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                You're all caught up! We'll notify you when there's new content, events, or messages.
              </p>
            </div>
          )}
        </div>
        
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-medium mb-2">Notification Settings</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Choose what types of notifications you want to receive.
          </p>
          <Button variant="outline" size="sm">
            Manage preferences
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Notifications;
