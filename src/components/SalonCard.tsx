
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SalonCardProps {
  id: string;
  name: string;
  imageUrl: string;
  rating: number;
  ratingCount: number;
  location: string;
  distance?: string;
  specialties?: string[];
  className?: string;
}

const SalonCard: React.FC<SalonCardProps> = ({
  id,
  name,
  imageUrl,
  rating,
  ratingCount,
  location,
  distance,
  specialties,
  className
}) => {
  return (
    <Link
      to={`/salon/${id}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl transition-all duration-300 hover:shadow-md animate-scale-in",
        className
      )}
    >
      <div className="aspect-[5/3] w-full overflow-hidden rounded-xl">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      
      <div className="flex flex-col p-3 space-y-1">
        <div className="flex items-start justify-between">
          <h3 className="font-medium line-clamp-1 text-balance">{name}</h3>
          <div className="flex items-center ml-2">
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            <span className="text-sm ml-1 font-medium">{rating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="flex items-center text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 mr-1" />
          <p className="text-xs truncate">{location}</p>
          {distance && (
            <span className="text-xs ml-2">• {distance}</span>
          )}
        </div>
        
        {specialties && specialties.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {specialties.slice(0, 3).map((specialty, index) => (
              <span 
                key={index}
                className="px-2 py-0.5 bg-secondary text-xs rounded-full"
              >
                {specialty}
              </span>
            ))}
            {specialties.length > 3 && (
              <span className="px-2 py-0.5 bg-secondary text-xs rounded-full">
                +{specialties.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default SalonCard;
