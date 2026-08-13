'use client';

import React, { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { DEMO_PLACES, DEMO_REVIEWS } from '@/lib/mock-data';
import { Place, Review } from '@/types';
import { PlaceGallery } from '@/components/places/PlaceGallery';
import { RatingStars } from '@/components/ui/RatingStars';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ReviewList } from '@/components/places/ReviewList';
import { ReviewForm } from '@/components/places/ReviewForm';
import { PlaceCard } from '@/components/places/PlaceCard';
import {
  MapPin,
  Clock,
  Heart,
  Share2,
  ExternalLink,
  Wifi,
  Zap,
  Wind,
  Armchair,
  Car,
  Compass,
  Dog,
  Airplay,
  Flame,
  Map as MapIcon,
  Navigation,
  Utensils,
  Coffee,
  Sparkles
} from 'lucide-react';

export default function PlaceDetailPage({ params }: { params: { slug: string } }) {
  const [place, setPlace] = useState<Place | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    let allPlaces: Place[] = DEMO_PLACES;
    const stored = localStorage.getItem('cs_places');
    if (stored) {
      try {
        allPlaces = JSON.parse(stored);
      } catch (e) {
        allPlaces = DEMO_PLACES;
      }
    }

    const foundPlace = allPlaces.find((p) => p.slug === params.slug);
    if (foundPlace) {
      setPlace(foundPlace);
      const placeRevs = DEMO_REVIEWS[foundPlace.id] || [];
      setReviews(placeRevs);

      const favs = JSON.parse(localStorage.getItem('cs_favorites') || '[]');
      if (favs.includes(foundPlace.id)) {
        setIsFavorite(true);
      }
    }
  }, [params.slug]);

  if (!place) {
    const placeBySlug = DEMO_PLACES.find((p) => p.slug === params.slug);
    if (!placeBySlug) return notFound();
  }

  const handleFavoriteToggle = () => {
    if (!place) return;
    const newFav = !isFavorite;
    setIsFavorite(newFav);

    const favs = JSON.parse(localStorage.getItem('cs_favorites') || '[]');
    if (newFav) {
      if (!favs.includes(place.id)) favs.push(place.id);
    } else {
      const idx = favs.indexOf(place.id);
      if (idx > -1) favs.splice(idx, 1);
    }
    localStorage.setItem('cs_favorites', JSON.stringify(favs));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: place?.name,
        text: `Cek tempat nongkrong ${place?.name} di CoffeSpot Banjarmasin!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReviewAdded = (newRev: Review) => {
    setReviews([newRev, ...reviews]);
  };

  const similarPlaces = DEMO_PLACES.filter(
    (p) => p.id !== place?.id && (p.category_id === place?.category_id || p.city === place?.city)
  ).slice(0, 3);

  // Exact Google Maps Pin Query using Latitude and Longitude
  const googleMapsPinUrl = `https://www.google.com/maps/search/?api=1&query=${place?.latitude},${place?.longitude}`;
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place?.latitude},${place?.longitude}`;
  const mapsEmbedUrl = `https://maps.google.com/maps?q=${place?.latitude},${place?.longitude}&hl=id&z=17&output=embed`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Breadcrumb & Title Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="terracotta" size="sm">
                {place?.category?.name || 'Coffee Shop'}
              </Badge>
              <span className="text-xs text-coffee-500">•</span>
              <span className="text-xs font-mono font-bold text-coffee-800 bg-coffee-100 px-2 py-0.5 rounded">
                {'$'.repeat(place?.price_level || 2)}
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-coffee-950">
              {place?.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-coffee-700">
              <RatingStars rating={place?.average_rating || 0} reviewCount={reviews.length} size="md" />
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-terracotta-500" />
                {place?.address}, {place?.city}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant={isFavorite ? 'danger' : 'outline'}
              size="sm"
              onClick={handleFavoriteToggle}
              leftIcon={<Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />}
            >
              {isFavorite ? 'Favorit Saya' : 'Simpan Favorit'}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShare} leftIcon={<Share2 className="w-4 h-4" />}>
              {copied ? 'Tersalin!' : 'Bagikan'}
            </Button>
            <a href={googleMapsDirectionsUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" size="sm" leftIcon={<Navigation className="w-4 h-4 text-amber-300" />} rightIcon={<ExternalLink className="w-4 h-4" />}>
                Petunjuk Arah Google Maps
              </Button>
            </a>
          </div>
        </div>

        {/* Gallery */}
        <PlaceGallery
          mainImageUrl={place?.image_url || ''}
          images={place?.images}
          title={place?.name || ''}
        />
      </div>

      {/* Main Content & Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Details, Map & Reviews */}
        <div className="lg:col-span-2 space-y-10">
          {/* Description */}
          <div className="space-y-3 bg-cream-50 p-6 rounded-3xl border border-coffee-200 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-coffee-950">Tentang Tempat</h2>
            <p className="text-sm text-coffee-800 leading-relaxed whitespace-pre-line">
              {place?.description}
            </p>
          </div>

          {/* Coffee & Food Menu List */}
          <div className="space-y-4 bg-cream-50 p-6 rounded-3xl border border-coffee-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-coffee-800 text-cream-50 flex items-center justify-center font-bold">
                  <Utensils className="w-4 h-4 text-amber-300" />
                </div>
                <h2 className="font-serif text-xl font-bold text-coffee-950">Daftar Menu Kopi & Makanan</h2>
              </div>
              <span className="text-xs text-coffee-600 font-semibold bg-coffee-100 px-3 py-1 rounded-full">
                {place?.menu_items?.length || 0} Pilihan Menu
              </span>
            </div>

            {place?.menu_items && place.menu_items.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {place.menu_items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-white border border-coffee-200/80 shadow-sm flex flex-col justify-between gap-2 hover:border-coffee-400 transition-colors"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-coffee-950 text-sm leading-snug">{item.name}</span>
                        <Badge variant="coffee" size="sm">{item.category}</Badge>
                      </div>
                      {item.description && (
                        <p className="text-xs text-coffee-600 mt-1 line-clamp-2">{item.description}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-coffee-100 mt-1">
                      <span className="font-mono font-extrabold text-sm text-coffee-900">
                        Rp {item.price.toLocaleString('id-ID')}
                      </span>
                      {item.is_recommended && (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-600" /> Rekomendasi
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center bg-white rounded-2xl border border-dashed border-coffee-300 space-y-1">
                <Coffee className="w-8 h-8 text-coffee-400 mx-auto" />
                <p className="text-xs font-semibold text-coffee-700">Belum ada daftar menu khusus untuk toko kopi ini.</p>
                <p className="text-[11px] text-coffee-500">Anda dapat menanyakan langsung di lokasi atau melihat katalog di kasir.</p>
              </div>
            )}
          </div>

          {/* Interactive Google Maps Embed with Exact Pin */}
          <div className="space-y-4 bg-cream-50 p-6 rounded-3xl border border-coffee-200 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-coffee-950 font-serif font-bold text-xl">
                <MapIcon className="w-5 h-5 text-terracotta-500" />
                <span>Peta Titik Lokasi Presisi Google Maps</span>
              </div>
              <div className="flex items-center gap-2">
                <a href={googleMapsPinUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" leftIcon={<MapPin className="w-3.5 h-3.5 text-terracotta-500" />}>
                    Buka Pin Lokasi
                  </Button>
                </a>
                <a href={googleMapsDirectionsUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="primary" size="sm" leftIcon={<Navigation className="w-3.5 h-3.5" />}>
                    Navigasi
                  </Button>
                </a>
              </div>
            </div>
            <p className="text-xs text-coffee-700">
              <MapPin className="w-3.5 h-3.5 text-terracotta-500 inline mr-1" />
              {place?.address}, {place?.city}
            </p>

            {/* Embedded Interactive Google Map Iframe Centered on Lat/Long */}
            <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-coffee-300 shadow-inner bg-coffee-100">
              <iframe
                title={`Peta Lokasi ${place?.name}`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={mapsEmbedUrl}
              ></iframe>
            </div>
          </div>

          {/* Mood Tags */}
          {place?.moods && place.moods.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-serif text-lg font-bold text-coffee-950">Karakter & Suasana</h3>
              <div className="flex flex-wrap gap-2">
                {place.moods.map((m) => (
                  <Badge key={m.id} variant="coffee" size="md">
                    #{m.name} ({m.score || 90}% match)
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Facilities List */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-coffee-950">Fasilitas Utama</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {place?.facilities?.map((fac) => (
                <div
                  key={fac.id}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-coffee-200/80 shadow-sm text-xs font-medium text-coffee-900"
                >
                  <div className="w-8 h-8 rounded-xl bg-coffee-100 text-coffee-800 flex items-center justify-center shrink-0">
                    {fac.name.includes('Wi-Fi') && <Wifi className="w-4 h-4" />}
                    {fac.name.includes('Colokan') && <Zap className="w-4 h-4" />}
                    {fac.name.includes('Outdoor') && <Wind className="w-4 h-4" />}
                    {fac.name.includes('Meja') && <Armchair className="w-4 h-4" />}
                    {fac.name.includes('Parkir') && <Car className="w-4 h-4" />}
                    {fac.name.includes('Musholla') && <Compass className="w-4 h-4" />}
                    {fac.name.includes('Pet') && <Dog className="w-4 h-4" />}
                    {fac.name.includes('AC') && <Airplay className="w-4 h-4" />}
                    {fac.name.includes('Merokok') && <Flame className="w-4 h-4" />}
                  </div>
                  <span>{fac.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* User Reviews Section */}
          <div className="space-y-6 pt-6 border-t border-coffee-200">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl font-bold text-coffee-950">Ulasan Pengguna</h3>
              <RatingStars rating={place?.average_rating || 0} reviewCount={reviews.length} size="md" />
            </div>

            <ReviewForm placeId={place?.id || ''} onReviewAdded={handleReviewAdded} />

            <ReviewList reviews={reviews} />
          </div>
        </div>

        {/* Right Sidebar: Operating Hours & Quick Map Actions */}
        <div className="space-y-6">
          {/* Operating Hours Box */}
          <div className="bg-cream-50 p-6 rounded-3xl border border-coffee-200 shadow-warm space-y-4">
            <div className="flex items-center gap-2 text-coffee-950 font-serif font-bold text-lg">
              <Clock className="w-5 h-5 text-terracotta-500" />
              <span>Jam Operasional</span>
            </div>
            <div className="space-y-2 text-xs text-coffee-800">
              {place?.opening_hours?.map((hour, idx) => (
                <div key={idx} className="flex justify-between py-1 border-b border-coffee-200/50">
                  <span className="font-semibold">{hour.day}</span>
                  <span className="font-mono">{hour.open} - {hour.close} WITA</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Direction Card */}
          <div className="bg-cream-50 p-6 rounded-3xl border border-coffee-200 shadow-warm space-y-4">
            <div className="flex items-center gap-2 text-coffee-950 font-serif font-bold text-lg">
              <Navigation className="w-5 h-5 text-terracotta-500" />
              <span>Navigasi Langsung</span>
            </div>
            <p className="text-xs text-coffee-700 leading-relaxed">
              {place?.address}, {place?.city}
            </p>
            <div className="space-y-2 pt-1">
              <a href={googleMapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className="block">
                <Button variant="primary" size="sm" className="w-full justify-center" leftIcon={<Navigation className="w-3.5 h-3.5" />}>
                  Petunjuk Arah Rute
                </Button>
              </a>
              <a href={googleMapsPinUrl} target="_blank" rel="noopener noreferrer" className="block">
                <Button variant="outline" size="sm" className="w-full justify-center" leftIcon={<MapPin className="w-3.5 h-3.5 text-terracotta-500" />}>
                  Buka Pin Lokasi Google Maps
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Places Section */}
      {similarPlaces.length > 0 && (
        <div className="space-y-6 pt-10 border-t border-coffee-200">
          <h2 className="font-serif text-2xl font-bold text-coffee-950">Rekomendasi Kafe Banjarmasin Lainnya</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarPlaces.map((sp) => (
              <PlaceCard key={sp.id} place={sp} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
