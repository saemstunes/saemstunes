import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Target, Medal } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AchievementPanelProps {
  userId?: string;
}

const AchievementPanel = ({ userId }: AchievementPanelProps) => {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [userAchievements, setUserAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadAchievements();
    }
  }, [userId]);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      
      // Load all achievements
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')
        .order('category');
      
      if (achievementsError) throw achievementsError;

      // Load user achievements if user is logged in
      let userAchievementsData = [];
      if (userId) {
        const { data, error } = await supabase
          .from('user_achievements')
          .select('*')
          .eq('user_id', userId);
        
        if (!error) {
          userAchievementsData = data || [];
        }
      }

      setAchievements(achievementsData || []);
      setUserAchievements(userAchievementsData);
    } catch (error) {
      console.error('Error loading achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center">
            <Trophy className="h-4 w-4 mr-2" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Sign in to track your achievements
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center">
            <Trophy className="h-4 w-4 mr-2" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get user progress for each achievement
  const achievementsWithProgress = achievements.map(achievement => {
    const userAchievement = userAchievements.find(ua => ua.achievement_id === achievement.id);
    return {
      ...achievement,
      progress: userAchievement?.progress || 0,
      unlocked: userAchievement?.unlocked || false,
      unlocked_at: userAchievement?.unlocked_at
    };
  });

  const unlockedCount = achievementsWithProgress.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  const getAchievementIcon = (category: string, tier: string) => {
    switch (tier) {
      case 'gold':
        return Trophy;
      case 'silver':
        return Medal;
      case 'bronze':
        return Star;
      default:
        return Target;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'gold':
        return 'text-yellow-600';
      case 'silver':
        return 'text-gray-400';
      case 'bronze':
        return 'text-amber-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            <span className="flex items-center">
              <Trophy className="h-4 w-4 mr-2" />
              Achievements
            </span>
            <Badge variant="outline">
              {unlockedCount}/{totalCount}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 mb-4">
            <div className="flex justify-between text-xs">
              <span>Overall Progress</span>
              <span>{Math.round((unlockedCount / totalCount) * 100)}%</span>
            </div>
            <Progress value={(unlockedCount / totalCount) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Recent/Featured Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Recent Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {achievementsWithProgress
            .filter(a => a.progress > 0 || a.unlocked)
            .sort((a, b) => {
              if (a.unlocked && !b.unlocked) return -1;
              if (!a.unlocked && b.unlocked) return 1;
              return b.progress - a.progress;
            })
            .slice(0, 4)
            .map(achievement => {
              const Icon = getAchievementIcon(achievement.category, achievement.tier);
              return (
                <div key={achievement.id} className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <Icon className={`h-4 w-4 mt-0.5 ${getTierColor(achievement.tier)} ${achievement.unlocked ? 'animate-pulse' : ''}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium truncate ${achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {achievement.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                  {!achievement.unlocked && achievement.progress < 100 && (
                    <div className="ml-6">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress}%</span>
                      </div>
                      <Progress value={achievement.progress} className="h-1" />
                    </div>
                  )}
                  {achievement.unlocked && (
                    <div className="ml-6">
                      <Badge className="text-xs" variant="secondary">
                        Unlocked!
                      </Badge>
                    </div>
                  )}
                </div>
              );
            })}
          {achievementsWithProgress.filter(a => a.progress > 0 || a.unlocked).length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-2">
              Start learning to unlock achievements!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AchievementPanel;