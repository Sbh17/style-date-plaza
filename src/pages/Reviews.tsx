
import React, { useState } from 'react';
import { 
  Star, MessageSquare, ThumbsUp, ThumbsDown, Flag
} from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Mock review data
const MOCK_REVIEWS = [
  { 
    id: "r1", 
    customer: { name: "Jennifer Smith", email: "jennifer@example.com", avatar: "https://i.pravatar.cc/150?u=jennifer" },
    service: "Haircut & Style",
    date: "2023-10-15",
    rating: 5,
    text: "Absolutely loved my haircut and color! The staff was friendly and professional. Will definitely be coming back.",
    status: "published",
    likes: 12,
    flags: 0
  },
  { 
    id: "r2", 
    customer: { name: "Michael Brown", email: "michael@example.com", avatar: "https://i.pravatar.cc/150?u=michael" },
    service: "Color & Style",
    date: "2023-10-16",
    rating: 4,
    text: "Great service and atmosphere. My stylist was knowledgeable and gave me exactly what I asked for.",
    status: "published",
    likes: 8,
    flags: 0
  },
  { 
    id: "r3", 
    customer: { name: "Sarah Johnson", email: "sarah@example.com", avatar: "https://i.pravatar.cc/150?u=sarah" },
    service: "Manicure",
    date: "2023-10-17",
    rating: 5,
    text: "The best nail salon in town! The technicians are skilled and the place is spotlessly clean.",
    status: "published",
    likes: 15,
    flags: 0
  },
  { 
    id: "r4", 
    customer: { name: "David Wilson", email: "david@example.com", avatar: "https://i.pravatar.cc/150?u=david" },
    service: "Facial",
    date: "2023-10-18",
    rating: 3,
    text: "The facial was average. The aesthetician was nice but could have explained the process better.",
    status: "awaiting_approval",
    likes: 0,
    flags: 0
  },
  { 
    id: "r5", 
    customer: { name: "Emily Davis", email: "emily@example.com", avatar: "https://i.pravatar.cc/150?u=emily" },
    service: "Pedicure",
    date: "2023-10-19",
    rating: 2,
    text: "Disappointed with my experience. The service took longer than promised and wasn't up to standard.",
    status: "awaiting_approval",
    likes: 0,
    flags: 1
  }
];

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [replyText, setReplyText] = useState('');
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);

  const pendingReviews = reviews.filter(review => review.status === 'awaiting_approval');
  
  const handleApproveReview = (reviewId: string) => {
    const updatedReviews = reviews.map(review => 
      review.id === reviewId ? { ...review, status: 'published' } : review
    );
    setReviews(updatedReviews);
    toast.success('Review approved successfully!');
  };
  
  const handleRejectReview = (reviewId: string) => {
    const updatedReviews = reviews.map(review => 
      review.id === reviewId ? { ...review, status: 'rejected' } : review
    );
    setReviews(updatedReviews);
    toast.success('Review rejected');
  };
  
  const handleSendReply = () => {
    // In a real app, we would send this reply to the backend
    console.log(`Replying to ${selectedReview.customer.name}: ${replyText}`);
    toast.success(`Reply sent to ${selectedReview.customer.name}`);
    setReplyText('');
    setIsReplyDialogOpen(false);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold flex items-center">
              <MessageSquare className="mr-2 h-5 w-5 text-primary" />
              Customer Reviews Management
            </h1>
            <p className="text-muted-foreground text-sm">
              Manage, respond to, and monitor customer reviews
            </p>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="all">All Reviews</TabsTrigger>
            <TabsTrigger value="pending">
              Pending
              {pendingReviews.length > 0 && (
                <Badge className="ml-2 bg-primary text-primary-foreground">
                  {pendingReviews.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>All Customer Reviews</CardTitle>
                <CardDescription>
                  View and manage all customer reviews for your salon
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviews.map((review) => (
                      <TableRow key={review.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={review.customer.avatar} alt={review.customer.name} />
                              <AvatarFallback>{review.customer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{review.customer.name}</p>
                              <p className="text-xs text-muted-foreground">{review.customer.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{review.service}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {Array(5).fill(0).map((_, idx) => (
                              <Star
                                key={idx}
                                className={`h-4 w-4 ${
                                  idx < review.rating
                                    ? "text-amber-500 fill-amber-500"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(review.date)}</TableCell>
                        <TableCell>
                          <Badge className={`${
                            review.status === 'published' 
                              ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                              : review.status === 'awaiting_approval'
                                ? 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                                : 'bg-red-100 text-red-800 hover:bg-red-100'
                          }`}>
                            {review.status === 'published' 
                              ? 'Published' 
                              : review.status === 'awaiting_approval' 
                                ? 'Pending' 
                                : 'Rejected'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedReview(review);
                                setIsReplyDialogOpen(true);
                              }}
                            >
                              Reply
                            </Button>
                            {review.status === 'awaiting_approval' && (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-green-600"
                                  onClick={() => handleApproveReview(review.id)}
                                >
                                  Approve
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-red-600"
                                  onClick={() => handleRejectReview(review.id)}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pending" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Reviews</CardTitle>
                <CardDescription>
                  Reviews awaiting your approval before being published
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingReviews.length > 0 ? (
                  <div className="space-y-4">
                    {pendingReviews.map((review) => (
                      <div key={review.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={review.customer.avatar} alt={review.customer.name} />
                              <AvatarFallback>{review.customer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{review.customer.name}</p>
                              <p className="text-sm text-muted-foreground">{formatDate(review.date)}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {Array(5).fill(0).map((_, idx) => (
                              <Star
                                key={idx}
                                className={`h-4 w-4 ${
                                  idx < review.rating
                                    ? "text-amber-500 fill-amber-500"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Service: {review.service}</p>
                          <p className="text-sm">{review.text}</p>
                        </div>
                        
                        <div className="flex justify-between items-center pt-2">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{review.likes}</span>
                            </div>
                            {review.flags > 0 && (
                              <div className="flex items-center gap-1">
                                <Flag className="h-4 w-4 text-red-500" />
                                <span className="text-sm text-red-500">{review.flags}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-green-600"
                              onClick={() => handleApproveReview(review.id)}
                            >
                              Approve
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-600"
                              onClick={() => handleRejectReview(review.id)}
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No pending reviews to approve
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Review Analytics</CardTitle>
                <CardDescription>
                  Insights and statistics about your salon's reviews
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-primary/10 p-4 rounded-xl space-y-2">
                    <p className="text-sm text-muted-foreground">Average Rating</p>
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-amber-500 fill-amber-500 mr-1" />
                      <span className="text-2xl font-bold">4.6</span>
                      <span className="text-sm text-muted-foreground ml-2">/ 5</span>
                    </div>
                  </div>
                  
                  <div className="bg-primary/10 p-4 rounded-xl space-y-2">
                    <p className="text-sm text-muted-foreground">Total Reviews</p>
                    <div className="flex items-center">
                      <MessageSquare className="h-5 w-5 text-primary mr-1" />
                      <span className="text-2xl font-bold">{reviews.length}</span>
                    </div>
                  </div>
                  
                  <div className="bg-primary/10 p-4 rounded-xl space-y-2">
                    <p className="text-sm text-muted-foreground">Response Rate</p>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold">92%</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-3">Rating Distribution</h3>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map(rating => {
                      const count = reviews.filter(r => r.rating === rating).length;
                      const percentage = (count / reviews.length) * 100;
                      
                      return (
                        <div key={rating} className="flex items-center">
                          <div className="w-8 text-sm">{rating} ★</div>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden mx-2">
                            <div 
                              className="h-full bg-primary rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <div className="w-12 text-sm text-right">{count}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to Review</DialogTitle>
            <DialogDescription>
              {selectedReview && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={selectedReview?.customer.avatar} alt={selectedReview?.customer.name} />
                      <AvatarFallback>{selectedReview?.customer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{selectedReview?.customer.name}</span>
                  </div>
                  <div className="bg-muted p-3 rounded-md text-sm mb-3">
                    {selectedReview?.text}
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Textarea 
                placeholder="Type your reply here..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReplyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendReply} disabled={!replyText.trim()}>
              Send Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Reviews;
