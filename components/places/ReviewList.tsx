import React from 'react';
import Image from 'next/image';
import { Review } from '@/types';
import { RatingStars } from '@/components/ui/RatingStars';
import { MessageSquare } from 'lucide-react';

interface ReviewListProps {
  reviews: Review[];
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-10 bg-coffee-50/50 rounded-2xl border border-dashed border-coffee-200">
        <MessageSquare className="w-8 h-8 text-coffee-400 mx-auto mb-2" />
        <p className="text-sm font-semibold text-coffee-800">Belum ada ulasan untuk tempat ini.</p>
        <p className="text-xs text-coffee-600">Jadilah pengguna pertama yang membagikan pengalaman kamu!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((rev) => (
        <div key={rev.id} className="p-4 rounded-2xl bg-white border border-coffee-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full overflow-hidden bg-coffee-200">
                <Image
                  src={rev.user_profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt={rev.user_profile?.full_name || 'User Avatar'}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="text-sm font-bold text-coffee-950">
                  {rev.user_profile?.full_name || 'Pengguna CoffeSpot'}
                </h4>
                <p className="text-[11px] text-coffee-500">
                  {new Date(rev.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <RatingStars rating={rev.rating} showNumber={false} size="sm" />
          </div>

          <p className="text-xs text-coffee-800 leading-relaxed pl-12">
            {rev.comment}
          </p>
        </div>
      ))}
    </div>
  );
};
