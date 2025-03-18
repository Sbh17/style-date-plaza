
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { News } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface NewsPromoFormProps {
  salonId: string;
  onSuccess?: () => void;
  existingNews?: News;
}

const NewsPromoForm: React.FC<NewsPromoFormProps> = ({ 
  salonId, 
  onSuccess,
  existingNews 
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [title, setTitle] = useState(existingNews?.title || '');
  const [content, setContent] = useState(existingNews?.content || '');
  const [imageUrl, setImageUrl] = useState(existingNews?.image_url || '');
  const [startsAt, setStartsAt] = useState(
    existingNews?.starts_at 
      ? new Date(existingNews.starts_at).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0]
  );
  const [endsAt, setEndsAt] = useState(
    existingNews?.ends_at 
      ? new Date(existingNews.ends_at).toISOString().split('T')[0] 
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content || !startsAt || !endsAt) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (new Date(endsAt) <= new Date(startsAt)) {
      toast.error('End date must be after start date');
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, submit to Supabase
      // const { data, error } = await supabase
      //   .from('news')
      //   .upsert({
      //     id: existingNews?.id,
      //     salon_id: salonId,
      //     title,
      //     content,
      //     image_url: imageUrl,
      //     starts_at: startsAt,
      //     ends_at: endsAt,
      //     is_approved: false,
      //     created_at: existingNews?.created_at || new Date().toISOString(),
      //     updated_at: new Date().toISOString()
      //   })
      //   .select()
      //   .single();
      
      // if (error) throw error;

      // Simulate successful API call
      setTimeout(() => {
        toast.success(
          existingNews 
            ? 'Promotion updated and sent for approval' 
            : 'Promotion created and sent for approval'
        );
        if (onSuccess) onSuccess();
        
        // Reset form if it's a new submission
        if (!existingNews) {
          setTitle('');
          setContent('');
          setImageUrl('');
          setStartsAt(new Date().toISOString().split('T')[0]);
          setEndsAt(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
        }
        
        setIsSubmitting(false);
      }, 1000);
    } catch (error: any) {
      console.error('Error submitting promotion:', error);
      toast.error(`Error: ${error.message || 'Failed to submit promotion'}`);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Promotion Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="E.g., Summer Special Offer"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content">Description *</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Describe your promotion..."
          rows={4}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
        <p className="text-xs text-muted-foreground">
          An image URL for your promotion (optional)
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startsAt">Start Date *</Label>
          <Input
            id="startsAt"
            type="date"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="endsAt">End Date *</Label>
          <Input
            id="endsAt"
            type="date"
            value={endsAt}
            onChange={(e) => setEndsAt(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="pt-2">
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting 
            ? 'Submitting...' 
            : existingNews 
              ? 'Update Promotion' 
              : 'Create Promotion'}
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Note: All promotions must be approved by an administrator before they become visible.
        </p>
      </div>
    </form>
  );
};

export default NewsPromoForm;
