
import { useNavigate } from 'react-router-dom';
import VideoCard from './VideoCard';
import { VideoContent } from '@/data/mockData';

interface VideoCardWrapperProps {
  video: VideoContent;
  isPremium?: boolean;
  onClick?: () => void;
}

/**
 * A wrapper component for VideoCard that handles onClick events
 * This provides a solution to the TypeScript error without modifying the original VideoCard component
 */
const VideoCardWrapper = ({ video, isPremium = false, onClick }: VideoCardWrapperProps) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/videos/${video.id}`);
    }
  };
  
  return (
    <div 
      onClick={handleClick}
      className="cursor-pointer transition-transform hover:scale-105"
    >
      <VideoCard video={video} isPremium={isPremium} />
    </div>
  );
};

export default VideoCardWrapper;
