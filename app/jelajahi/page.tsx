'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { DEMO_PLACES } from '@/lib/mock-data';
import { FilterState, Place } from '@/types';
import { PlaceFilter } from '@/components/places/PlaceFilter';
import { PlaceCard } from '@/components/places/PlaceCard';
import { Button } from '@/components/ui/Button';
import { Compass, Coffee, MapPin, Loader2, Sparkles, Navigation } from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  search: '',
  category_id: '',
  mood_slug: '',
  price_level: null,
  min_rating: null,
  facility_ids: [],
  open_now: false,
  city: '',
};

export default function JelajahiPage() {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [displayCount, setDisplayCount] = useState<number>(9);
  const [livePlaces, setLivePlaces] = useState<Place[]>(DEMO_PLACES);
  const [isLoadingLive, setIsLoadingLive] = useState<boolean>(false);
  const [searchSource, setSearchSource] = useState<string>('local');

  // Perform Live Google Maps API fetch whenever search changes
  useEffect(() => {
    const query = filters.search.trim();

    if (!query) {
      const stored = localStorage.getItem('cs_places');
      if (stored) {
        try {
          setLivePlaces(JSON.parse(stored));
        } catch (e) {
          setLivePlaces(DEMO_PLACES);
        }
      } else {
        setLivePlaces(DEMO_PLACES);
      }
      setSearchSource('local');
      setIsLoadingLive(false);
      return;
    }

    setIsLoadingLive(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      fetch(`/api/places/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => {
          if (data.results && data.results.length > 0) {
            setLivePlaces(data.results);
            setSearchSource(data.source || 'pure_map');
          }
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            console.error('Map search fetch error:', err);
          }
        })
        .finally(() => {
          setIsLoadingLive(false);
        });
    }, 200);

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [filters.search]);

  // When text search is active, bypass local static filters completely!
  const filteredPlaces = useMemo(() => {
    if (filters.search.trim() !== '') {
      return livePlaces;
    }

    return livePlaces.filter((place) => {
      if (filters.category_id && place.category_id !== filters.category_id) {
        return false;
      }
      if (filters.mood_slug && !place.moods?.some((m) => m.slug === filters.mood_slug)) {
        return false;
      }
      if (filters.city && place.city.toLowerCase() !== filters.city.toLowerCase()) {
        return false;
      }
      if (filters.price_level !== null && place.price_level !== filters.price_level) {
        return false;
      }
      if (filters.min_rating !== null && place.average_rating < filters.min_rating) {
        return false;
      }
      if (filters.facility_ids.length > 0) {
        const placeFacIds = place.facilities?.map((f) => f.id) || [];
        const hasAllFacilities = filters.facility_ids.every((id) => placeFacIds.includes(id));
        if (!hasAllFacilities) return false;
      }

      return true;
    });
  }, [livePlaces, filters]);

  const visiblePlaces = filteredPlaces.slice(0, displayCount);
  const hasMore = displayCount < filteredPlaces.length;

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setDisplayCount(9);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-terracotta-600 font-bold text-xs uppercase tracking-widest">
          <Navigation className="w-4 h-4 text-terracotta-500" />
          <span>Pencarian Live Google Maps (Tanpa Batas Database)</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-coffee-950">
          Jelajahi Kafe di Banjarmasin
        </h1>
        <p className="text-sm text-coffee-700 max-w-2xl">
          Ketik nama kafe <strong>APAPUN</strong> yang Anda ketahui di Banjarmasin. Pencarian akan mengambil hasil langsung dari peta Google Maps!
        </p>
      </div>

      {/* Filter Component */}
      <PlaceFilter
        filters={filters}
        onFilterChange={setFilters}
        onResetFilters={handleResetFilters}
        totalResults={filteredPlaces.length}
      />

      {/* Live Map Indicator */}
      {filters.search.trim() !== '' && (
        <div className="flex items-center justify-between bg-coffee-900 text-cream-50 border border-coffee-800 px-5 py-3.5 rounded-2xl text-xs font-semibold shadow-warm">
          <div className="flex items-center gap-2.5">
            {isLoadingLive ? (
              <Loader2 className="w-4 h-4 animate-spin text-terracotta-400" />
            ) : (
              <Sparkles className="w-4 h-4 text-amber-400" />
            )}
            <span>
              {isLoadingLive
                ? `Mencari "${filters.search}" secara langsung di Google Maps...`
                : `Menampilkan hasil pencarian Google Maps untuk "${filters.search}"`}
            </span>
          </div>
          <span className="flex items-center gap-1.5 text-[11px] bg-terracotta-500 text-white px-3 py-1 rounded-full font-mono font-bold">
            <MapPin className="w-3.5 h-3.5" />
            Live Google Maps
          </span>
        </div>
      )}

      {/* Results Grid */}
      {visiblePlaces.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visiblePlaces.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setDisplayCount((prev) => prev + 9)}
              >
                Muat Lebih Banyak Hasil Maps
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20 bg-cream-50 rounded-3xl border border-coffee-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-coffee-100 flex items-center justify-center mx-auto text-coffee-600">
            <Coffee className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-xl text-coffee-950">
              Tidak Ada Hasil untuk &quot;{filters.search}&quot;
            </h3>
            <p className="text-xs text-coffee-700 max-w-md mx-auto">
              Coba ketik kata kunci nama kafe lain di Banjarmasin.
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={handleResetFilters}>
            Reset Pencarian
          </Button>
        </div>
      )}
    </div>
  );
}
