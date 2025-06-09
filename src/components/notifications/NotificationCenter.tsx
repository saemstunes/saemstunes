
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Music, CreditCard, Video, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

const NotificationCenter = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    fetchNotifications();
    
    // Set up realtime listener for new notifications
    const channel = supabase
      .channel('notifications-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications'
      }, (payload) => {
        const newNotification = payload.new as Notification;
        
        // Check if notification is for this user
        if (shouldShowNotification(newNotification)) {
          setNotifications(prev => [newNotification, ...prev]);
          
          // Show toast for new notification
          toast({
            title: "New notification",
            description: newNotification.message,
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const shouldShowNotification = (notification: Notification) => {
    if (!user) return false;
    
    // Check if it's a personal notification
    if (notification.user_id === user.id) return true;
    
    // Check if user has access based on their tier
    const userTier = user.subscriptionTier || 'free';
    const visibleTo = notification.visible_to;
    
    if (visibleTo === 'all') return true;
    if (visibleTo === 'signed-in' && user) return true;
    if (visibleTo === userTier) return true;
    
    return false;
  };

  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      const userTier = user.subscriptionTier || 'free';
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .or(`user_id.eq.${user.id},visible_to.eq.all,visible_to.eq.signed-in,visible_to.eq.${userTier}`)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new-track':
        return <Music className="h-5 w-5 text-gold" />;
      case 'payment-success':
        return <CreditCard className="h-5 w-5 text-green-500" />;
      case 'video-upload':
        return <Video className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Bell className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Sign in for notifications</h3>
          <p className="text-muted-foreground text-center">
            Get notified about new tracks, updates, and more when you sign in.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Bell className="h-8 w-8 animate-pulse text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
        </h2>
        <span className="text-sm text-muted-foreground">
          {notifications.filter(n => !n.read).length} unread
        </span>
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
            <p className="text-muted-foreground text-center">
              You'll see notifications here when there are updates for you.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`transition-opacity ${notification.read ? 'opacity-60' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {getNotificationIcon(notification.type)}
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{notification.message}</p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(notification.created_at).toLocaleString()}
                    </span>
                  </div>
                  
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
