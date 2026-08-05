'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DEMO_PLACES } from '@/lib/mock-data';
import { Place } from '@/types';
import { PlaceCard } from '@/components/places/PlaceCard';
import { Button } from '@/components/ui/Button';
import { Heart, Compass } from 'lucide-react';

export default function FavoritPage() {
  const [favoritePlaces, setFavoritePlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load favorites directly from localStorage
    const favIds: string[] = JSON.parse(localStorage.getItem('cs_favorites') || '[]');
    const places = DEMO_PLACES.filter((p) => favIds.includes(p.id)).map((p) => ({ ...p, is_favorite: true }));
    setFavoritePlaces(places);
    setLoading(false);
  }, []);

  const handleFavoriteToggle = (placeId: string, isFav: boolean) => {
    if (!isFav) {
      setFavoritePlaces((prev) => prev.filter((p) => p.id !== placeId));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-terracotta-600 font-bold text-xs uppercase tracking-widest">
          <Heart className="w-4 h-4 fill-current text-terracotta-500" />
          <span>Koleksi Simpanan Kamu</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-coffee-950">
          Kafe Favorit Saya di Banjarmasin
        </h1>
        <p className="text-sm text-coffee-700">
          Daftar tempat nongkrong yang sudah kamu simpan. Data favorit kamu tersimpan secara otomatis di browser.
        </p>
      </div>

      {favoritePlaces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoritePlaces.map((place) => (
            <PlaceCard key={place.id} place={place} onFavoriteToggle={handleFavoriteToggle} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-cream-50 rounded-3xl border border-coffee-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-coffee-100 flex items-center justify-center mx-auto text-coffee-600">
            <Heart className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-xl text-coffee-950">Belum Ada Kafe Favorit</h3>
            <p className="text-xs text-coffee-700 max-w-md mx-auto">
              Kamu belum menyimpan kafe ke daftar favorit. Klik ikon hati pada kartu tempat untuk menyimpannya di sini.
            </p>
          </div>
          <Link href="/jelajahi">
            <Button variant="primary" size="sm" leftIcon={<Compass className="w-4 h-4" />}>
              Jelajahi Kafe Banjarmasin
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
