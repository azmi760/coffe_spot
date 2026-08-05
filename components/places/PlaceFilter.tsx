'use client';

import React from 'react';
import { Search, RotateCcw, Clock, Sparkles } from 'lucide-react';
import { DEMO_CATEGORIES, DEMO_MOODS, DEMO_FACILITIES } from '@/lib/mock-data';
import { FilterState } from '@/types';
import { Button } from '@/components/ui/Button';

interface PlaceFilterProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  totalResults: number;
}

export const PlaceFilter: React.FC<PlaceFilterProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, category_id: e.target.value });
  };

  const handleMoodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, mood_slug: e.target.value });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, city: e.target.value });
  };

  const handlePriceClick = (level: number) => {
    const newPrice = filters.price_level === level ? null : level;
    onFilterChange({ ...filters, price_level: newPrice });
  };

  const handleFacilityToggle = (facilityId: string) => {
    const exists = filters.facility_ids.includes(facilityId);
    const updated = exists
      ? filters.facility_ids.filter((id) => id !== facilityId)
      : [...filters.facility_ids, facilityId];
    onFilterChange({ ...filters, facility_ids: updated });
  };

  const handleOpenNowToggle = () => {
    onFilterChange({ ...filters, open_now: !filters.open_now });
  };

  const hasActiveFilters =
    filters.search !== '' ||
    filters.category_id !== '' ||
    filters.mood_slug !== '' ||
    filters.city !== '' ||
    filters.price_level !== null ||
    filters.min_rating !== null ||
    filters.facility_ids.length > 0 ||
    filters.open_now;

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-coffee-200/90 p-6 shadow-warm space-y-6">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-[480px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-terracotta-500" />
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Cari kafe (contoh: Nordu, Kopitagram, Fore, Sultan Adam)..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-coffee-200 bg-cream-50/60 text-sm text-coffee-950 font-medium placeholder-coffee-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-all shadow-inner"
          />
        </div>

        {/* Results Info & Clear Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <span className="text-xs font-bold text-coffee-800 flex items-center gap-1.5 bg-coffee-100/80 px-3 py-1.5 rounded-full border border-coffee-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Menampilkan <strong className="text-terracotta-600 text-sm font-extrabold">{totalResults}</strong> Kafe</span>
          </span>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              leftIcon={<RotateCcw className="w-3.5 h-3.5 text-terracotta-500" />}
              className="text-terracotta-600 hover:bg-terracotta-50 text-xs font-bold"
            >
              Hapus Filter
            </Button>
          )}
        </div>
      </div>

      {/* Select Dropdowns Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-coffee-100">
        {/* Category Dropdown */}
        <div>
          <label className="block text-xs font-extrabold text-coffee-900 uppercase tracking-wider mb-1.5">
            Kategori
          </label>
          <select
            value={filters.category_id}
            onChange={handleCategoryChange}
            className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 bg-white text-xs font-medium text-coffee-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
          >
            <option value="">Semua Kategori</option>
            {DEMO_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Mood Dropdown */}
        <div>
          <label className="block text-xs font-extrabold text-coffee-900 uppercase tracking-wider mb-1.5">
            Suasana / Mood
          </label>
          <select
            value={filters.mood_slug}
            onChange={handleMoodChange}
            className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 bg-white text-xs font-medium text-coffee-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
          >
            <option value="">Semua Mood</option>
            {DEMO_MOODS.map((m) => (
              <option key={m.id} value={m.slug}>
                #{m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Area Banjarmasin Dropdown */}
        <div>
          <label className="block text-xs font-extrabold text-coffee-900 uppercase tracking-wider mb-1.5">
            Wilayah Banjarmasin
          </label>
          <select
            value={filters.city}
            onChange={handleCityChange}
            className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 bg-white text-xs font-medium text-coffee-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
          >
            <option value="">Semua Wilayah</option>
            {['Banjarmasin Tengah', 'Banjarmasin Utara', 'Banjarmasin Timur', 'Banjarmasin Barat', 'Banjarmasin Selatan'].map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        {/* Open Now Toggle */}
        <div className="flex flex-col justify-end">
          <button
            type="button"
            onClick={handleOpenNowToggle}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              filters.open_now
                ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
                : 'bg-white text-coffee-800 border-coffee-200 hover:bg-coffee-50'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Buka Sekarang</span>
          </button>
        </div>
      </div>

      {/* Quick Filter Pill Chips: Price */}
      <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-coffee-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold text-coffee-800 uppercase tracking-wider mr-1">Rentang Harga:</span>
          {[1, 2, 3, 4].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => handlePriceClick(level)}
              className={`px-3 py-1 rounded-xl text-xs font-mono font-extrabold transition-all ${
                filters.price_level === level
                  ? 'bg-gradient-to-r from-coffee-900 to-coffee-800 text-cream-50 shadow-md scale-105'
                  : 'bg-white text-coffee-800 border border-coffee-200 hover:bg-coffee-100'
              }`}
            >
              {'$'.repeat(level)}
            </button>
          ))}
        </div>
      </div>

      {/* Facilities Checkboxes */}
      <div className="pt-3 border-t border-coffee-100">
        <span className="block text-xs font-extrabold text-coffee-900 uppercase tracking-wider mb-2.5">
          Fasilitas Utama:
        </span>
        <div className="flex flex-wrap gap-2">
          {DEMO_FACILITIES.map((fac) => {
            const isSelected = filters.facility_ids.includes(fac.id);
            return (
              <button
                key={fac.id}
                type="button"
                onClick={() => handleFacilityToggle(fac.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-terracotta-500 text-white shadow-md scale-105'
                    : 'bg-white text-coffee-800 border border-coffee-200 hover:bg-coffee-100'
                }`}
              >
                {fac.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
