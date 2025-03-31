
import { useState, useEffect } from 'react';
import { Star, User, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';

interface Review {
  id: string;
  salon_id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles: {
    name: string;
  };
  salons: {
    name: string;
  };
}

const RecentReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select(`
            id,
            salon_id,
            rating,
            comment,
            created_at,
            profiles:user_id (
              name
            ),
            salons:salon_id (
              name
            )
          `)
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        
        setReviews(data || []);
      } catch (err) {
        console.error('Error fetching recent reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentReviews();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-medium">Recent Reviews</h2>
        </div>
        {[...Array(2)].map((_, idx) => (
          <div key={idx} className="animate-pulse p-3 border rounded-lg">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-muted rounded-full mr-2"></div>
              <div className="w-1/3 h-4 bg-muted rounded"></div>
              <div className="ml-auto w-20 h-4 bg-muted rounded"></div>
            </div>
            <div className="w-full h-4 bg-muted rounded mb-1"></div>
            <div className="w-2/3 h-4 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-medium">Recent Reviews</h2>
        <Button variant="link" className="text-sm p-0 h-auto text-primary" onClick={() => navigate('/explore')}>
          See All
        </Button>
      </div>
      
      {reviews.map((review) => (
        <div key={review.id} className="p-3 border rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium">{review.profiles?.name || 'Anonymous'}</span>
            </div>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3.5 w-3.5 ${
                    review.rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <Link to={`/salon/${review.salon_id}`} className="block">
            <p className="text-xs text-muted-foreground mb-1">
              <span className="font-medium">{review.salons?.name}</span> • {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
            </p>
            <p className="text-sm line-clamp-2">{review.comment}</p>
          </Link>
          
          <div className="mt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-7 px-2 text-primary"
              asChild
            >
              <Link to={`/salon/${review.salon_id}/reviews`} className="flex items-center gap-1">
                View all reviews
                <ChevronRight className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentReviews;
