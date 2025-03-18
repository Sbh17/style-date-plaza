
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { News, Salon } from '@/lib/supabase';

type NewsPromoCardProps = {
  news: News;
  salon?: Salon;
  className?: string;
}

const NewsPromoCard: React.FC<NewsPromoCardProps> = ({ news, salon, className }) => {
  // Check if the promotion is active
  const now = new Date();
  const startsAt = new Date(news.starts_at);
  const endsAt = new Date(news.ends_at);
  const isActive = now >= startsAt && now <= endsAt;

  if (!isActive || !news.is_approved) return null;

  return (
    <Card className={`overflow-hidden border-primary/10 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {news.image_url && (
            <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden">
              <img 
                src={news.image_url} 
                alt={news.title} 
                className="w-full h-full object-cover" 
              />
            </div>
          )}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-base">{news.title}</h3>
              {salon && <span className="text-xs text-muted-foreground">{salon.name}</span>}
            </div>
            <p className="text-sm mt-1 text-muted-foreground line-clamp-2">{news.content}</p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-primary font-medium">
                Valid until {new Date(news.ends_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsPromoCard;
