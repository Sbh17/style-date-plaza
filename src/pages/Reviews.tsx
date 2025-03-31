
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import ReviewForm from '@/components/ReviewForm';
import ReviewsList from '@/components/ReviewsList';

const Reviews = () => {
  const { id: salonId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [salonName, setSalonName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSalonDetails = async () => {
      if (!salonId) return;
      
      try {
        const { data, error } = await supabase
          .from('salons')
          .select('name')
          .eq('id', salonId)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setSalonName(data.name);
        }
      } catch (error) {
        console.error('Error fetching salon details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSalonDetails();
  }, [salonId]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleReviewSuccess = () => {
    // Refresh the reviews list
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">
            {loading ? 'Loading...' : `${salonName} Reviews`}
          </h1>
        </div>

        <div className="space-y-8">
          <ReviewsList salonId={salonId || ''} />
          
          {isAuthenticated && (
            <div className="border-t pt-6">
              <h2 className="text-lg font-medium mb-4">Write a Review</h2>
              <ReviewForm 
                salonId={salonId || ''} 
                onSuccess={handleReviewSuccess} 
              />
            </div>
          )}
          
          {!isAuthenticated && (
            <div className="border-t pt-6 text-center">
              <p className="text-muted-foreground mb-3">
                Sign in to leave a review
              </p>
              <Button onClick={() => navigate('/sign-in')}>
                Sign In
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Reviews;
