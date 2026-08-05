'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, MapPin, Clock, ArrowRight, Zap, Wifi, Wind, Armchair, Navigation } from 'lucide-react';
import { Place } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { RatingStars } from '@/components/ui/RatingStars';
import { Button } from '@/components/ui/Button';

interface PlaceCardProps {
  place: Place;
  showMatchScore?: boolean;
  onFavoriteToggle?: (placeId: string, isFav: boolean) => void;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80';

export const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  showMatchScore = false,
  onFavoriteToggle,
}) => {
  const [isFavorite, setIsFavorite] = useState(place.is_favorite || false);
  const [imgSrc, setImgSrc] = useState(place.image_url || FALLBACK_IMAGE);

  useEffect(() => {
    setImgSrc(place.image_url || FALLBACK_IMAGE);
    const favs = JSON.parse(localStorage.getItem('cs_favorites') || '[]');
    if (favs.includes(place.id)) {
      setIsFavorite(true);
    }
  }, [place.id, place.image_url]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const newFavState = !isFavorite;
    setIsFavorite(newFavState);

    const favs = JSON.parse(localStorage.getItem('cs_favorites') || '[]');
    if (newFavState) {
      if (!favs.includes(place.id)) favs.push(place.id);
    } else {
      const idx = favs.indexOf(place.id);
      if (idx > -1) favs.splice(idx, 1);
    }
    localStorage.setItem('cs_favorites', JSON.stringify(favs));

    if (onFavoriteToggle) {
      onFavoriteToggle(place.id, newFavState);
    }
  };

  const directMapsUrl = `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`;
  const isOpenNow = true;
  const priceDisplay = '$'.repeat(place.price_level || 2);

  return (
    <div className="group bg-cream-50 rounded-2xl border border-coffee-200/80 shadow-warm hover:shadow-warm-hover transition-all duration-300 flex flex-col overflow-hidden relative transform hover:-translate-y-1">
      {/* Top Media Image Container */}
      <div className="relative w-full h-52 overflow-hidden bg-coffee-100 flex items-center justify-center">
        <img
          src={imgSrc}
          alt={place.name}
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        {/* Match Percentage Badge */}
        {showMatchScore && place.match_score && (
          <div className="absolute top-3 left-3 z-10 bg-terracotta-500 text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
            <span>✨ {place.match_score}% Cocok</span>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-transform active:scale-90 ${
            isFavorite
              ? 'bg-red-500 text-white shadow-md'
              : 'bg-cream-50/80 hover:bg-cream-50 text-coffee-900 shadow-sm'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Status Tag & Category Badge */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs z-10">
          <Badge variant={isOpenNow ? 'emerald' : 'gray'} size="sm" icon={<Clock className="w-3 h-3" />}>
            {isOpenNow ? 'Buka Sekarang' : 'Tutup'}
          </Badge>
          <span className="font-mono font-bold text-cream-100 bg-coffee-950/70 px-2 py-0.5 rounded backdrop-blur-sm border border-cream-100/20">
            {priceDisplay}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-terracotta-600 tracking-wide uppercase">
              {place.category?.name || 'Coffee Shop'}
            </span>
            <RatingStars rating={place.average_rating || 4.8} reviewCount={place.review_count || 30} size="sm" />
          </div>

          <Link href={`/tempat/${place.slug}`} className="block group-hover:text-terracotta-600 transition-colors">
            <h3 className="font-serif text-lg font-bold text-coffee-950 line-clamp-1">
              {place.name}
            </h3>
          </Link>

          <p className="text-xs text-coffee-700 flex items-center gap-1 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-terracotta-500 shrink-0" />
            <span>{place.address}, {place.city}</span>
          </p>

          <p className="text-xs text-coffee-600 line-clamp-2 leading-relaxed pt-1">
            {place.description}
          </p>
        </div>

        {/* Mood & Facilities Tags */}
        <div className="space-y-3 pt-2 border-t border-coffee-200/50">
          {/* Mood Tags */}
          {place.moods && place.moods.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {place.moods.slice(0, 3).map((mood) => (
                <Badge key={mood.id} variant="coffee" size="sm">
                  #{mood.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Key Facilities Icons */}
          {place.facilities && place.facilities.length > 0 && (
            <div className="flex items-center gap-3 text-xs text-coffee-600">
              {place.facilities.slice(0, 4).map((fac) => (
                <span key={fac.id} className="flex items-center gap-1 bg-coffee-100/60 px-2 py-0.5 rounded text-[11px]" title={fac.name}>
                  {fac.name.includes('Wi-Fi') && <Wifi className="w-3 h-3 text-coffee-700" />}
                  {fac.name.includes('Colokan') && <Zap className="w-3 h-3 text-coffee-700" />}
                  {fac.name.includes('Outdoor') && <Wind className="w-3 h-3 text-coffee-700" />}
                  {fac.name.includes('Meja') && <Armchair className="w-3 h-3 text-coffee-700" />}
                  <span>{fac.name}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* CTA Footer with Direct Maps Button */}
        <div className="pt-2 grid grid-cols-5 gap-2">
          <Link href={`/tempat/${place.slug}`} className="col-span-3">
            <Button variant="secondary" size="sm" className="w-full justify-between group-hover:bg-coffee-800 group-hover:text-cream-50 transition-all duration-200" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Detail Kafe
            </Button>
          </Link>
          <a
            href={directMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="col-span-2"
            title="Buka titik lokasi langsung di Google Maps"
          >
            <Button variant="outline" size="sm" className="w-full justify-center border-terracotta-500/40 text-terracotta-600 hover:bg-terracotta-50" leftIcon={<Navigation className="w-3.5 h-3.5" />}>
              Peta
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};
