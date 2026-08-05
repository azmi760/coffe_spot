'use client';

import React, { useState, useEffect } from 'react';
import { PlaceImage } from '@/types';

interface PlaceGalleryProps {
  mainImageUrl: string;
  images?: PlaceImage[];
  title: string;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80';

export const PlaceGallery: React.FC<PlaceGalleryProps> = ({
  mainImageUrl,
  images = [],
  title,
}) => {
  const validMainImage = mainImageUrl || FALLBACK_IMAGE;
  const allImages = images.length > 0 ? images.map((i) => i.image_url).filter(Boolean) : [validMainImage];
  const [selectedImage, setSelectedImage] = useState(allImages[0] || validMainImage);
  const [currentSrc, setCurrentSrc] = useState(allImages[0] || validMainImage);

  useEffect(() => {
    const initial = allImages[0] || validMainImage;
    setSelectedImage(initial);
    setCurrentSrc(initial);
  }, [mainImageUrl, images]);

  const handleImageSelect = (imgUrl: string) => {
    setSelectedImage(imgUrl);
    setCurrentSrc(imgUrl);
  };

  const handleImageError = () => {
    setCurrentSrc(FALLBACK_IMAGE);
  };

  return (
    <div className="space-y-3">
      {/* Featured Main Image Container */}
      <div className="relative w-full h-[340px] md:h-[480px] rounded-3xl overflow-hidden border border-coffee-200 shadow-warm bg-coffee-100 flex items-center justify-center">
        {/* Standard img tag for 100% resilient rendering across all browsers */}
        <img
          src={currentSrc}
          alt={title}
          onError={handleImageError}
          className="w-full h-full object-cover transition-all duration-300"
        />
      </div>

      {/* Thumbnails Row */}
      {allImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleImageSelect(img)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                selectedImage === img
                  ? 'border-terracotta-500 ring-2 ring-terracotta-500/30 scale-105'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`${title} ${idx + 1}`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                }}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
