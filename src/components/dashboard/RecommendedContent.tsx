
import { useAuth } from "@/context/AuthContext";
import { mockVideos, VideoContent } from "@/data/mockData";
import VideoCard from "../videos/VideoCard";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

const RecommendedContent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Function to get personalized recommendations based on user role
  const getRecommendedVideos = (): VideoContent[] => {
    // Filter videos - free videos for everyone, locked videos only for subscribers
    let filteredVideos = mockVideos.filter(
      (video) => !video.isLocked || (user && user.subscribed)
    );

    // Sort or filter based on user role
    if (user) {
      switch (user.role) {
        case "student":
          // Prioritize beginner content for students
          filteredVideos.sort((a, b) => {
            if (a.level === "beginner" && b.level !== "beginner") return -1;
            if (a.level !== "beginner" && b.level === "beginner") return 1;
            return 0;
          });
          break;
        case "adult_learner":
          // Adult learners might be interested in all levels
          break;
        case "tutor":
          // Tutors might be interested in teaching methods
          filteredVideos = filteredVideos.filter(
            (video) => video.category === "Vocal Development" || video.level === "advanced"
          );
          break;
        default:
          break;
      }
    }

    // Limit to 3 videos
    return filteredVideos.slice(0, 3);
  };

  const recommendedVideos = getRecommendedVideos();

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-serif font-semibold">Recommended For You</h2>
        <Button 
          variant="link" 
          onClick={() => navigate("/videos")}
          className="text-gold hover:text-gold-dark"
        >
          View All <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendedVideos.map((video) => (
          <VideoCard key={video.id} video={video} isPremium={video.isLocked} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedContent;
