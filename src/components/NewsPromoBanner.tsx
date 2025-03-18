
import React, { useState, useEffect } from 'react';
import { Megaphone, BadgePercent } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import NewsPromoCard from './NewsPromoCard';
import { News, Salon } from '@/lib/supabase';

// Mock data for development
const MOCK_NEWS: (News & { salon: Salon })[] = [
  {
    id: '1',
    salon_id: '1',
    title: '50% Off on All Hair Services',
    content: 'Enjoy half price on all haircuts, coloring, and styling this week. Book now to secure your spot!',
    starts_at: new Date(Date.now() - 86400000).toISOString(), // yesterday
    ends_at: new Date(Date.now() + 604800000).toISOString(), // a week from now
    is_approved: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    salon: {
      id: '1',
      name: 'Elegance Beauty Salon',
      description: 'Premium salon services',
      address: '123 Main St',
      city: 'Downtown',
      state: 'NY',
      zip_code: '10001',
      phone: '555-1234',
      email: 'info@elegancebeauty.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  },
  {
    id: '2',
    salon_id: '2',
    title: 'New Customer Special',
    content: 'First-time customers receive a complimentary deep conditioning treatment with any service.',
    starts_at: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    ends_at: new Date(Date.now() + 604800000 * 2).toISOString(), // 2 weeks from now
    is_approved: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    salon: {
      id: '2',
      name: 'Pure Bliss Spa & Salon',
      description: 'Relaxation and beauty treatments',
      address: '456 Oak Ave',
      city: 'Westside',
      state: 'CA',
      zip_code: '90210',
      phone: '555-5678',
      email: 'contact@purebliss.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  },
  {
    id: '3',
    salon_id: '3',
    title: 'Summer Package Deal',
    content: 'Book our summer package and get a manicure, pedicure, and facial for only $99.',
    starts_at: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    ends_at: new Date(Date.now() + 604800000 * 4).toISOString(), // 4 weeks from now
    is_approved: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    salon: {
      id: '3',
      name: 'Modern Cuts & Color',
      description: 'Trendy hair solutions',
      address: '789 Pine St',
      city: 'Midtown',
      state: 'IL',
      zip_code: '60601',
      phone: '555-9012',
      email: 'hello@moderncuts.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }
];

interface NewsPromoBannerProps {
  className?: string;
}

const NewsPromoBanner: React.FC<NewsPromoBannerProps> = ({ className }) => {
  const [newsItems, setNewsItems] = useState<(News & { salon: Salon })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // In a real app, fetch from Supabase
        // const { data, error } = await supabase
        //   .from('news')
        //   .select('*, salon:salons(*)')
        //   .eq('is_approved', true)
        //   .gte('ends_at', new Date().toISOString());
        
        // if (error) throw error;
        // setNewsItems(data || []);

        // For mock development
        setTimeout(() => {
          setNewsItems(MOCK_NEWS);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching promotions:', error);
        setNewsItems([]);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <Card className={`relative overflow-hidden ${className}`}>
        <CardContent className="p-4">
          <div className="animate-pulse flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-primary/10 rounded w-3/4"></div>
              <div className="h-3 bg-primary/10 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (newsItems.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-3">
        <BadgePercent className="h-5 w-5 text-primary" />
        <h3 className="font-medium">Latest Promotions & News</h3>
      </div>
      
      <Carousel className="w-full">
        <CarouselContent>
          {newsItems.map((item) => (
            <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
              <NewsPromoCard news={item} salon={item.salon} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-1" />
        <CarouselNext className="right-1" />
      </Carousel>
    </div>
  );
};

export default NewsPromoBanner;
