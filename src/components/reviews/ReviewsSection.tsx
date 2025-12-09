import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  ThumbsUp, 
  Camera, 
  MessageSquare, 
  Send,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  photos: string[];
  createdAt: string;
  helpful: number;
  ownerResponse?: {
    message: string;
    createdAt: string;
  };
}

interface ReviewsSectionProps {
  equipmentId: string;
  averageRating: number;
  totalReviews: number;
}

const mockReviews: Review[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Suresh Kumar',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=suresh',
    rating: 5,
    comment: 'Excellent tractor! Very well maintained and the operator was very skilled. Completed my field work in half the expected time. Will definitely rent again.',
    photos: [
      'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=400',
    ],
    createdAt: '2024-02-01',
    helpful: 12,
    ownerResponse: {
      message: 'Thank you Suresh! We are glad you had a great experience. Looking forward to serving you again.',
      createdAt: '2024-02-02',
    },
  },
  {
    id: '2',
    userId: '2',
    userName: 'Ramesh Patil',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ramesh',
    rating: 4,
    comment: 'Good equipment overall. Arrived on time and worked efficiently. Minor issue with the GPS but operator handled it well.',
    photos: [],
    createdAt: '2024-01-28',
    helpful: 8,
  },
  {
    id: '3',
    userId: '3',
    userName: 'Vijay Deshmukh',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vijay',
    rating: 5,
    comment: 'Best rental experience! The tractor was in perfect condition and the pricing was very fair. Highly recommended for all farmers.',
    photos: [
      'https://images.unsplash.com/photo-1605002989198-39d64e57520c?w=400',
      'https://images.unsplash.com/photo-1562051036-e0eea191d42f?w=400',
    ],
    createdAt: '2024-01-20',
    helpful: 15,
  },
];

const ratingDistribution = [
  { stars: 5, count: 45, percentage: 51 },
  { stars: 4, count: 28, percentage: 31 },
  { stars: 3, count: 12, percentage: 13 },
  { stars: 2, count: 3, percentage: 3 },
  { stars: 1, count: 1, percentage: 1 },
];

export function ReviewsSection({ equipmentId, averageRating, totalReviews }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [showAll, setShowAll] = useState(false);
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '', photos: [] as string[] });
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  const handleSubmitReview = () => {
    if (newReview.rating === 0) {
      toast({
        title: 'Rating Required',
        description: 'Please select a star rating',
        variant: 'destructive',
      });
      return;
    }
    if (!newReview.comment.trim()) {
      toast({
        title: 'Review Required',
        description: 'Please write your review',
        variant: 'destructive',
      });
      return;
    }

    const review: Review = {
      id: Date.now().toString(),
      userId: 'current',
      userName: 'You',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=you',
      rating: newReview.rating,
      comment: newReview.comment,
      photos: newReview.photos,
      createdAt: new Date().toISOString().split('T')[0],
      helpful: 0,
    };

    setReviews([review, ...reviews]);
    setNewReview({ rating: 0, comment: '', photos: [] });
    setShowAddReview(false);
    toast({
      title: 'Review Submitted',
      description: 'Thank you for your feedback!',
    });
  };

  const handlePhotoUpload = () => {
    // Mock photo upload
    const mockPhoto = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400';
    setNewReview({ ...newReview, photos: [...newReview.photos, mockPhoto] });
  };

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedReviews(newExpanded);
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-muted/30 rounded-2xl p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Average Rating */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <span className="text-5xl font-bold">{averageRating}</span>
              <div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= averageRating
                          ? 'fill-accent text-accent'
                          : 'fill-muted text-muted'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {totalReviews} reviews
                </p>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-2">
                <span className="text-sm w-8">{item.stars}★</span>
                <Progress value={item.percentage} className="h-2 flex-1" />
                <span className="text-sm text-muted-foreground w-8">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Review Button */}
      <Dialog open={showAddReview} onOpenChange={setShowAddReview}>
        <DialogTrigger asChild>
          <Button className="w-full md:w-auto">
            <Star className="w-4 h-4 mr-2" />
            Write a Review
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Write Your Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Star Rating */}
            <div>
              <p className="text-sm font-medium mb-2">Your Rating</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= newReview.rating
                          ? 'fill-accent text-accent'
                          : 'fill-muted text-muted-foreground'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Review Text */}
            <div>
              <p className="text-sm font-medium mb-2">Your Review</p>
              <Textarea
                placeholder="Share your experience with this equipment..."
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                rows={4}
              />
            </div>

            {/* Photo Upload */}
            <div>
              <p className="text-sm font-medium mb-2">Add Photos (Optional)</p>
              <div className="flex flex-wrap gap-2">
                {newReview.photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={photo}
                      alt="Review"
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <button
                      onClick={() => setNewReview({
                        ...newReview,
                        photos: newReview.photos.filter((_, i) => i !== index)
                      })}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={handlePhotoUpload}
                  className="w-20 h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center hover:border-primary transition-colors"
                >
                  <Camera className="w-6 h-6 text-muted-foreground" />
                </button>
              </div>
            </div>

            <Button className="w-full" onClick={handleSubmitReview}>
              <Send className="w-4 h-4 mr-2" />
              Submit Review
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reviews List */}
      <div className="space-y-4">
        <AnimatePresence>
          {displayedReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-border rounded-xl p-4"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={review.userAvatar} />
                    <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{review.userName}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
                              star <= review.rating
                                ? 'fill-accent text-accent'
                                : 'fill-muted text-muted'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">{review.createdAt}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  {review.helpful}
                </Button>
              </div>

              {/* Review Content */}
              <p className="text-muted-foreground mb-3">{review.comment}</p>

              {/* Review Photos */}
              {review.photos.length > 0 && (
                <div className="flex gap-2 mb-3">
                  {review.photos.map((photo, idx) => (
                    <img
                      key={idx}
                      src={photo}
                      alt="Review"
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                  ))}
                </div>
              )}

              {/* Owner Response */}
              {review.ownerResponse && (
                <div className="bg-muted/50 rounded-lg p-3 mt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">Owner Response</Badge>
                    <span className="text-xs text-muted-foreground">{review.ownerResponse.createdAt}</span>
                  </div>
                  <p className="text-sm">{review.ownerResponse.message}</p>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Show More/Less */}
      {reviews.length > 3 && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? (
            <>
              <ChevronUp className="w-4 h-4 mr-2" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-2" />
              Show All {reviews.length} Reviews
            </>
          )}
        </Button>
      )}
    </div>
  );
}