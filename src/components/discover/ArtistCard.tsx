import Link from 'next/link';

interface ArtistCardProps {
  id: string;
  name: string;
  role: string;
  imageSrc: string;
  slug: string; // Add slug to props
}

const ArtistCard: React.FC<ArtistCardProps> = ({ 
  id, 
  name, 
  role, 
  imageSrc, 
  slug 
}) => {
  return (
    <Link href={`/artist/${slug}`} passHref>
      <div className="rounded-lg overflow-hidden shadow-md bg-card cursor-pointer hover:shadow-lg transition-shadow">
        <img 
          src={imageSrc} 
          alt={name} 
          className="w-full aspect-square object-cover" 
        />
        <div className="p-3">
          <h3 className="font-bold">{name}</h3>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
    </Link>
  );
};
