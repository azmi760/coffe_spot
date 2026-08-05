'use client';

import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import { Review } from '@/types';

interface ReviewFormProps {
  placeId: string;
  onReviewAdded: (newReview: Review) => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ placeId, onReviewAdded }) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMsg('Silakan tuliskan komentar ulasan kamu.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    const storedUser = localStorage.getItem('cs_user');
    const currentUser = session?.user || (storedUser ? JSON.parse(storedUser) : null);

    const userName = currentUser?.user_metadata?.full_name || currentUser?.email?.split('@')[0] || 'Kamu';

    const newRevObj: Review = {
      id: 'rev-' + Date.now(),
      user_id: currentUser?.id || 'demo-user-id',
      place_id: placeId,
      rating,
      comment,
      created_at: new Date().toISOString(),
      user_profile: {
        full_name: userName,
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
      },
    };

    if (session?.user) {
      const { error } = await supabase.from('reviews').insert({
        user_id: session.user.id,
        place_id: placeId,
        rating,
        comment,
      });
      if (error) {
        if (error.code === '23505') {
          setErrorMsg('Kamu sudah memberikan ulasan untuk tempat ini sebelumnya.');
          setIsLoading(false);
          return;
        }
      }
    }

    onReviewAdded(newRevObj);
    setComment('');
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-cream-50 border border-coffee-200 shadow-sm space-y-4">
      <h4 className="font-serif font-bold text-base text-coffee-950">Tulis Ulasan Kamu</h4>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs border border-red-200">
          {errorMsg}
        </div>
      )}

      {/* Rating Picker */}
      <div>
        <label className="block text-xs font-semibold text-coffee-800 mb-1">Rating Tempat</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              className="p-1 focus:outline-none"
            >
              <Star
                className={`w-6 h-6 transition-colors ${
                  star <= (hoverRating || rating)
                    ? 'fill-amber-400 text-amber-500 scale-110'
                    : 'text-stone-300'
                }`}
              />
            </button>
          ))}
          <span className="text-xs font-bold text-coffee-900 ml-2">
            {rating} dari 5 Bintang
          </span>
        </div>
      </div>

      {/* Comment Input */}
      <div>
        <label className="block text-xs font-semibold text-coffee-800 mb-1">Ulasan / Pendapat Kamu</label>
        <textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Bagaimana pengalaman kamu di tempat ini? (Suasana, kebersihan, rasa kopi, Wi-Fi...)"
          className="w-full p-3 rounded-xl border border-coffee-200 bg-white text-xs text-coffee-950 focus:outline-none focus:ring-2 focus:ring-coffee-600"
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          size="sm"
          isLoading={isLoading}
          leftIcon={<Send className="w-3.5 h-3.5" />}
        >
          Kirim Ulasan
        </Button>
      </div>
    </form>
  );
};
