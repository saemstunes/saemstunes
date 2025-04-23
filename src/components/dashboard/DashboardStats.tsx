
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRole } from "@/context/AuthContext";
import { Video, BookOpen, Calendar, Music } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}

const StatsCard = ({ title, value, description, icon }: StatsCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

interface DashboardStatsProps {
  role: UserRole;
}

const DashboardStats = ({ role }: DashboardStatsProps) => {
  // Common stats for all users
  const commonStats = [
    {
      title: "Video Lessons",
      value: "12",
      description: "4 new this week",
      icon: <Video className="h-4 w-4 text-gold" />,
    },
    {
      title: "Resources",
      value: "24",
      description: "6 new this month",
      icon: <BookOpen className="h-4 w-4 text-gold" />,
    },
  ];

  // Role-specific stats
  const roleStats = {
    student: [
      {
        title: "Upcoming Lessons",
        value: "2",
        description: "Next on Monday",
        icon: <Calendar className="h-4 w-4 text-gold" />,
      },
      {
        title: "Practice Streak",
        value: "5 days",
        description: "Keep it up!",
        icon: <Music className="h-4 w-4 text-gold" />,
      },
    ],
    adult: [
      {
        title: "Learning Progress",
        value: "42%",
        description: "Piano basics",
        icon: <Music className="h-4 w-4 text-gold" />,
      },
      {
        title: "Upcoming Sessions",
        value: "1",
        description: "Next on Wednesday",
        icon: <Calendar className="h-4 w-4 text-gold" />,
      },
    ],
    parent: [
      {
        title: "Children Enrolled",
        value: "2",
        description: "Both active",
        icon: <Music className="h-4 w-4 text-gold" />,
      },
      {
        title: "Upcoming Bookings",
        value: "3",
        description: "This week",
        icon: <Calendar className="h-4 w-4 text-gold" />,
      },
    ],
    teacher: [
      {
        title: "Active Students",
        value: "8",
        description: "2 new this month",
        icon: <Music className="h-4 w-4 text-gold" />,
      },
      {
        title: "Scheduled Sessions",
        value: "12",
        description: "This week",
        icon: <Calendar className="h-4 w-4 text-gold" />,
      },
    ],
    admin: [
      {
        title: "Total Users",
        value: "124",
        description: "12 new this week",
        icon: <Music className="h-4 w-4 text-gold" />,
      },
      {
        title: "Active Subscriptions",
        value: "87",
        description: "3 new today",
        icon: <Calendar className="h-4 w-4 text-gold" />,
      },
    ],
  };

  const stats = [...commonStats, ...roleStats[role]];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          description={stat.description}
          icon={stat.icon}
        />
      ))}
    </div>
  );
};

export default DashboardStats;
