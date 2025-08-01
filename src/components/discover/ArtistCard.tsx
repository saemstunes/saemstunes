import React from 'react';
import { Link } from 'react-router-dom'; // Use react-router-dom's Link

interface ArtistCardProps {
  id: string;
  name: string;
  role: string;
  imageSrc: string;
  slug: string;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ 
  id, 
  name, 
  role, 
  imageSrc, 
  slug 
}) => {
  return (
    <Link to={`/artist/${slug}`} className="block"> {/* Correct Link component */}
      <div className="rounded-lg overflow-hidden shadow-md bg-card cursor-pointer hover:shadow-lg transition-shadow duration-300 group">
        <div className="relative aspect-square overflow-hidden">
          <img 
            src={imageSrc || '/artist-placeholder.jpg'}
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-3">
          <h3 className="font-bold truncate">{name}</h3>
          <p className="text-sm text-muted-foreground truncate">{role}</p>
        </div>
      </div>
    </Link>
  );
};

export default ArtistCard;
