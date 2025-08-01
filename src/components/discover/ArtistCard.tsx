import React from 'react';
import { Link } from 'react-router-dom';

interface ArtistCardProps {
  name: string;
  role: string;
  imageSrc: string;
  slug: string; // Slug is required for routing
}

const ArtistCard: React.FC<ArtistCardProps> = ({ 
  name, 
  role, 
  imageSrc, 
  slug 
}) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/artist-placeholder.jpg';
    e.currentTarget.classList.add('opacity-80');
  };

  return (
    <Link 
      to={`/artist/${slug}`}
      className="block rounded-lg overflow-hidden shadow-md bg-card hover:shadow-lg transition-all duration-300 group"
      aria-label={`View ${name}'s profile`}
    >
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={imageSrc || '/artist-placeholder.jpg'}
          alt={`${name}'s profile picture`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={handleImageError}
        />
      </div>
      <div className="p-3">
        <h3 className="font-bold truncate text-foreground">{name}</h3>
        <p className="text-sm text-muted-foreground truncate">{role}</p>
      </div>
    </Link>
  );
};

export default ArtistCard;
