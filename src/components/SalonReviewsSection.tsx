
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Star, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSalonRating } from '@/utils/adminUtils';

interface SalonReviewsSectionProps {
  className?: string;
}

const SalonReviewsSection = ({ className }: SalonReviewsSectionProps) => {
  const { id: salonId } = useParams();
  const [rating, setRating] = useState<number | null>(null);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRating = async () => {
      if (!salonId) return;
      
      try {
        const ratingData = await getSalonRating(salonId);
        
        if (ratingData) {
          setRating(ratingData.rating);
          setReviewCount(ratingData.count);
        }
      } catch (error) {
        console.error('Error fetching salon rating:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRating();
  }, [salonId]);

  if (loading) {
    return (
      <div className={`${className} animate-pulse`}>
        <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-muted rounded w-2/3"></div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium mb-1">Reviews</h3>
          {rating ? (
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Star
                    key={value}
                    className={`h-4 w-4 ${
                      rating >= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm">
                {rating.toFixed(1)} ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No reviews yet</p>
          )}
        </div>
        
        <Button variant="ghost" asChild>
          <Link to={`/salon/${salonId}/reviews`} className="flex items-center gap-1">
            See all
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default SalonReviewsSection;
