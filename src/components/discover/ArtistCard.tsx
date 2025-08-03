import React from 'react';
import { Link } from 'react-router-dom';

interface ArtistCardProps {
  name: string;
  role: string;
  imageSrc: string;
  slug: string; // Only necessary props
}

const ArtistCard: React.FC<ArtistCardProps> = ({ 
  name, 
  role, 
  imageSrc, 
  slug 
}) => {
  return (
    <Link 
      to={`/artist/${slug}`} 
      className="block rounded-lg overflow-hidden shadow-md bg-card hover:shadow-lg transition-shadow duration-300 group"
    >
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={imageSrc || '/default-artist.jpg'}
          alt={`${name} profile`} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/default-artist.jpg';
          }}
        />
      </div>
      <div className="p-3">
        <h3 className="font-bold truncate">{name}</h3>
        <p className="text-sm text-muted-foreground truncate">{role}</p>
      </div>
    </Link>
  );
};

export default ArtistCard;
