
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { updateSalonRating } from '@/utils/adminUtils';

export interface Review {
  id: string;
  user_id: string;
  salon_id: string;
  appointment_id?: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles?: {
    name: string;
    profile_image: string | null;
  } | null;
}

export const useReviews = (salonId: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles(name, profile_image)
        `)
        .eq('salon_id', salonId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match the Review interface
      const formattedData = data?.map(review => ({
        ...review,
        profiles: review.profiles as { name: string; profile_image: string | null } | null
      })) || [];

      setReviews(formattedData);
      setReviewCount(formattedData.length || 0);
      
      // Calculate average rating
      if (formattedData && formattedData.length > 0) {
        const total = formattedData.reduce((sum, review) => sum + review.rating, 0);
        setAverageRating(Number((total / formattedData.length).toFixed(1)));
      } else {
        setAverageRating(null);
      }
      
      setError(null);
    } catch (err: any) {
      console.error('Error fetching reviews:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addReview = async (reviewData: Omit<Review, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert(reviewData)
        .select()
        .single();

      if (error) throw error;

      // Update the reviews list
      await fetchReviews();
      
      // Update the salon's rating
      await updateSalonRating(salonId);
      
      return data;
    } catch (err: any) {
      console.error('Error adding review:', err);
      toast.error(`Failed to add review: ${err.message}`);
      throw err;
    }
  };

  useEffect(() => {
    if (salonId) {
      fetchReviews();
    }
  }, [salonId]);

  return {
    reviews,
    averageRating,
    reviewCount,
    loading,
    error,
    fetchReviews,
    addReview
  };
};
