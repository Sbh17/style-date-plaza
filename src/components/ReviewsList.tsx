
import { useState, useEffect } from 'react';
import { Star, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';

interface Review {
  id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles?: {
    name: string;
    profile_image: string | null;
  };
}

interface ReviewsListProps {
  salonId: string;
  limit?: number;
}

const ReviewsList = ({ salonId, limit = 5 }: ReviewsListProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState<number | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select(`
            *,
            profiles:user_id (
              name,
              profile_image
            )
          `)
          .eq('salon_id', salonId)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) throw error;

        setReviews(data || []);
        
        // Calculate average rating
        if (data && data.length > 0) {
          const total = data.reduce((sum, review) => sum + review.rating, 0);
          setAverageRating(Number((total / data.length).toFixed(1)));
        }
      } catch (err: any) {
        console.error('Error fetching reviews:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [salonId, limit]);

  if (loading) {
    return <div className="animate-pulse space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-4 border rounded-lg">
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
            <div className="w-1/3 h-4 bg-gray-200 rounded"></div>
          </div>
          <div className="w-full h-4 bg-gray-200 rounded mb-2"></div>
          <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading reviews: {error}</div>;
  }

  if (reviews.length === 0) {
    return <div className="text-center text-muted-foreground py-8">No reviews yet. Be the first to review!</div>;
  }

  return (
    <div className="space-y-6">
      {averageRating !== null && (
        <div className="flex items-center gap-2 mb-4">
          <div className="text-2xl font-semibold">{averageRating}</div>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((value) => (
              <Star
                key={value}
                className={`h-5 w-5 ${
                  averageRating >= value
                    ? 'fill-yellow-400 text-yellow-400'
                    : averageRating >= value - 0.5
                    ? 'fill-yellow-400 text-yellow-400 opacity-60'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-muted-foreground">
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="p-4 border rounded-lg">
            <div className="flex items-center mb-2">
              <div className="mr-3">
                {review.profiles?.profile_image ? (
                  <img
                    src={review.profiles.profile_image}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                )}
              </div>
              <div>
                <div className="font-medium">
                  {review.profiles?.name || 'Anonymous User'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                </div>
              </div>
              <div className="ml-auto flex">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Star
                    key={value}
                    className={`h-4 w-4 ${
                      review.rating >= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsList;
