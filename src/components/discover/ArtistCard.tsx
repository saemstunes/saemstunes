
import React from 'react';

interface ArtistCardProps {
  name: string;
  role: string;
  imageSrc: string;
  onClick: () => void;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ name, role, imageSrc, onClick }) => {
  return (
    <div 
      className="rounded-lg overflow-hidden shadow-md bg-card cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <img src={imageSrc} alt={name} className="w-full aspect-square object-cover" />
      <div className="p-3">
        <h3 className="font-bold">{name}</h3>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  );
};

export default ArtistCard;
