
import { Star, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const SalonReviewFeaturePromo = () => {
  const navigate = useNavigate();

  const goToExplore = () => {
    navigate('/explore');
  };

  return (
    <div className="bg-primary/5 rounded-xl p-4 mt-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="bg-primary/10 p-2 rounded-full">
          <Star className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium mb-1">New: Salon Reviews</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Find the best salons with ratings and reviews from our community.
          </p>
          <Button onClick={goToExplore} className="w-full sm:w-auto flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Explore Rated Salons
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SalonReviewFeaturePromo;
