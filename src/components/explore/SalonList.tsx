
import React from 'react';
import { Button } from '@/components/ui/button';
import SalonCard from '@/components/SalonCard';
import { type SimplifiedSalon } from '@/hooks/useSalons';

interface SalonListProps {
  salons: SimplifiedSalon[];
  isLoading: boolean;
  isSeeding: boolean;
  error: unknown;
  manualSeedData: () => Promise<void>;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

const SalonList: React.FC<SalonListProps> = ({
  salons,
  isLoading,
  isSeeding,
  error,
  manualSeedData,
  resetFilters,
  hasActiveFilters,
}) => {
  if (error) {
    return (
      <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
        <p>Error loading salons: {error instanceof Error ? error.message : 'Unknown error'}</p>
        <div className="flex gap-2 mt-2">
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
          <Button 
            variant="default" 
            onClick={manualSeedData}
            disabled={isSeeding}
          >
            {isSeeding ? "Seeding..." : "Seed Database"}
          </Button>
        </div>
      </div>
    );
  }
  
  if (isLoading || isSeeding) {
    return (
      <>
        {Array(6).fill(0).map((_, idx) => (
          <div key={idx} className="rounded-xl overflow-hidden animate-pulse">
            <div className="aspect-[5/3] bg-muted"></div>
            <div className="p-3 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </>
    );
  }
  
  if (salons.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No salons found matching your criteria</p>
        {hasActiveFilters ? (
          <Button variant="outline" className="mt-2" onClick={resetFilters}>
            Clear filters
          </Button>
        ) : (
          <Button 
            variant="default" 
            className="mt-2" 
            onClick={manualSeedData}
            disabled={isSeeding}
          >
            {isSeeding ? "Seeding Database..." : "Seed Database with Sample Data"}
          </Button>
        )}
      </div>
    );
  }
  
  return (
    <>
      {salons.map((salon, index) => (
        <SalonCard
          key={salon.id}
          id={salon.id}
          name={salon.name}
          imageUrl={salon.imageUrl}
          rating={salon.rating}
          ratingCount={salon.ratingCount}
          location={salon.location}
          distance={salon.distance}
          specialties={salon.specialties}
          className={`animation-delay-${index % 3}00`}
        />
      ))}
    </>
  );
};

export default SalonList;
