'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DEMO_MOODS, DEMO_PLACES } from '@/lib/mock-data';
import { PlaceCard } from '@/components/places/PlaceCard';
import { Button } from '@/components/ui/Button';
import { Place } from '@/types';
import { Sparkles, Compass, Star, ArrowRight, Coffee, Heart, Target, Users, BookOpen, Smile, Camera, Music, Moon, VolumeX, MapPin, Zap } from 'lucide-react';

export default function HomePage() {
  const [allPlaces, setAllPlaces] = useState<Place[]>(DEMO_PLACES);

  useEffect(() => {
    const stored = localStorage.getItem('cs_places');
    if (stored) {
      try {
        setAllPlaces(JSON.parse(stored));
      } catch (e) {
        setAllPlaces(DEMO_PLACES);
      }
    }
  }, []);

  const popularPlaces = allPlaces.slice(0, 3);
  const topRatedPlaces = [...allPlaces].sort((a, b) => b.average_rating - a.average_rating).slice(0, 3);
  const latestPlaces = [...allPlaces].reverse().slice(0, 3);

  return (
    <div className="space-y-24 pb-24">
      {/* 1. ULTRA MODERN HERO SECTION */}
      <section className="relative min-h-[620px] flex items-center justify-center pt-14 pb-20 px-4 overflow-hidden bg-gradient-to-b from-coffee-100/80 via-cream-50 to-cream-50">
        {/* Glowing Aura Mesh Background */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-r from-terracotta-500/20 via-amber-500/20 to-emerald-500/20 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse-glow" />
        <div className="absolute top-32 right-10 w-72 h-72 bg-amber-400/15 rounded-full blur-2xl -z-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Top Floating Badge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-coffee-950 to-coffee-800 text-cream-50 text-xs font-bold shadow-warm border border-terracotta-500/30">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <MapPin className="w-3.5 h-3.5 text-terracotta-400" />
            <span>Panduan Rekomendasi Kafe &amp; Coffee Shop Banjarmasin</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold text-coffee-950 tracking-tight leading-[1.12]">
            Temukan Kafe Impianmu <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-coffee-900 via-terracotta-500 to-amber-500 bg-clip-text text-transparent italic drop-shadow-sm">
              Di Banjarmasin Sesuai Mood
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-coffee-700 max-w-2xl mx-auto leading-relaxed font-medium">
            Jelajahi coffee shop artisan, kafe nugas Kayutangi, dan tempat nongkrong estetik pinggir Sungai Martapura secara instan &amp; terhubung langsung ke Google Maps!
          </p>

          {/* Action CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <Link href="/rekomendasi" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-terracotta-500 to-amber-500 hover:from-terracotta-600 hover:to-amber-600 text-white font-extrabold shadow-glow-terracotta hover:scale-105 transition-all duration-300"
                leftIcon={<Sparkles className="w-5 h-5 text-amber-200" />}
              >
                Cari Berdasarkan Mood
              </Button>
            </Link>
            <Link href="/jelajahi" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-coffee-800 text-coffee-950 hover:bg-coffee-900 hover:text-cream-50 font-bold hover:scale-105 transition-all duration-300"
                leftIcon={<Compass className="w-5 h-5" />}
              >
                Jelajahi Semua Kafe
              </Button>
            </Link>
          </div>

          {/* Quick Metrics Cards */}
          <div className="pt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { label: 'Kafe Banjarmasin', val: '14+ Spot', color: 'from-amber-500 to-terracotta-500' },
              { label: 'Kawasan Terliput', val: '5 Wilayah', color: 'from-emerald-500 to-teal-600' },
              { label: 'Pilihan Mood', val: '10 Mood', color: 'from-purple-500 to-indigo-600' },
              { label: 'Rating Pengguna', val: '4.9 ★', color: 'from-rose-500 to-amber-500' },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-coffee-200/80 shadow-warm hover:shadow-warm-hover hover:-translate-y-1 transition-all duration-300 text-left space-y-1"
              >
                <div className={`w-8 h-1 rounded-full bg-gradient-to-r ${stat.color} mb-2`} />
                <span className="font-serif font-extrabold text-2xl text-coffee-950 block">{stat.val}</span>
                <span className="text-xs text-coffee-600 font-bold uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. COLORFUL MOOD SELECTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta-500/10 text-terracotta-600 text-xs font-extrabold uppercase tracking-widest">
            <Zap className="w-3.5 h-3.5" />
            <span>Pilih Suasana Hati</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-coffee-950">
            Kamu Lagi Ingin Suasana Seperti Apa?
          </h2>
          <p className="text-sm text-coffee-700 max-w-lg mx-auto font-medium">
            Pilih mood kafe favoritmu di Banjarmasin untuk langsung melihat rekomendasi presisi.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {DEMO_MOODS.map((m) => {
            // Color mapping for each mood card
            const moodStyle =
              m.slug === 'santai'
                ? 'from-emerald-500 to-teal-600'
                : m.slug === 'fokus'
                ? 'from-amber-500 to-amber-600'
                : m.slug === 'nugas'
                ? 'from-indigo-500 to-blue-600'
                : m.slug === 'ngobrol'
                ? 'from-terracotta-500 to-rose-600'
                : m.slug === 'romantis'
                ? 'from-rose-500 to-pink-600'
                : m.slug === 'ramai'
                ? 'from-amber-400 to-orange-500'
                : m.slug === 'tenang'
                ? 'from-teal-600 to-emerald-700'
                : m.slug === 'live-music'
                ? 'from-purple-600 to-indigo-600'
                : m.slug === 'estetik'
                ? 'from-fuchsia-500 to-purple-600'
                : 'from-slate-800 to-coffee-950';

            return (
              <Link
                key={m.id}
                href={`/rekomendasi?mood=${m.slug}`}
                className="group p-5 rounded-2xl bg-white border border-coffee-200/80 shadow-warm hover:shadow-warm-hover hover:border-terracotta-500/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${moodStyle} text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}
                >
                  {m.slug === 'santai' && <Smile className="w-6 h-6" />}
                  {m.slug === 'fokus' && <Target className="w-6 h-6" />}
                  {m.slug === 'nugas' && <BookOpen className="w-6 h-6" />}
                  {m.slug === 'ngobrol' && <Users className="w-6 h-6" />}
                  {m.slug === 'romantis' && <Heart className="w-6 h-6" />}
                  {m.slug === 'ramai' && <Sparkles className="w-6 h-6" />}
                  {m.slug === 'tenang' && <VolumeX className="w-6 h-6" />}
                  {m.slug === 'live-music' && <Music className="w-6 h-6" />}
                  {m.slug === 'estetik' && <Camera className="w-6 h-6" />}
                  {m.slug === 'nongkrong-malam' && <Moon className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-bold text-coffee-950 text-sm group-hover:text-terracotta-500 transition-colors">
                    {m.name}
                  </h3>
                  <p className="text-[11px] text-coffee-600 mt-1 line-clamp-2 leading-snug">
                    {m.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. REKOMENDASI POPULER BANJARMASIN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-terracotta-500">
              Terfavorit di Banjarmasin
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-coffee-950">Rekomendasi Populer</h2>
          </div>
          <Link href="/jelajahi">
            <Button variant="ghost" size="sm" className="font-bold text-terracotta-600 hover:bg-terracotta-50" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Lihat Semua Kafe
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {popularPlaces.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      </section>

      {/* 4. LUXURY DARK SECTION: RATING TERTINGGI */}
      <section className="bg-gradient-to-b from-coffee-950 via-coffee-900 to-coffee-950 text-cream-50 py-20 px-4 border-y border-coffee-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
                Paling Banyak Dipuji Pengguna
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream-50">Rating Tertinggi Banjarmasin</h2>
            </div>
            <Link href="/jelajahi?rating=4.8">
              <Button variant="secondary" size="sm" className="bg-amber-500 hover:bg-amber-600 text-coffee-950 font-extrabold" rightIcon={<Star className="w-4 h-4 text-coffee-950 fill-current" />}>
                Cari Tempat Bintang 4.8+
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topRatedPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. SPOT KOPI BARU BANJARMASIN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600">
              Spot Kopi Hits Baru
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-coffee-950">Tempat Nongkrong Terbaru</h2>
          </div>
          <Link href="/jelajahi">
            <Button variant="ghost" size="sm" className="font-bold text-coffee-800" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Jelajahi Katalog
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestPlaces.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-r from-coffee-900 via-coffee-800 to-terracotta-600 text-cream-50 p-8 sm:p-14 rounded-3xl shadow-glow-terracotta text-center space-y-6 relative overflow-hidden border border-terracotta-500/30">
          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-cream-50/10 backdrop-blur-md flex items-center justify-center mx-auto text-amber-300 shadow-md">
              <Coffee className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream-50 leading-tight">
              Siap Menemukan Kafe Impianmu di Banjarmasin?
            </h2>
            <p className="text-sm sm:text-base text-coffee-200 leading-relaxed font-medium">
              Temukan Nordu Cafe, Kopitagram Kayutangi, spot santai Siring Martapura, atau kafe nugas Sultan Adam dalam hitungan detik.
            </p>
            <div className="pt-2 flex justify-center gap-4">
              <Link href="/rekomendasi">
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-600 text-coffee-950 font-extrabold shadow-glow-amber hover:scale-105 transition-transform"
                  leftIcon={<Sparkles className="w-5 h-5 text-coffee-950" />}
                >
                  Cari Berdasarkan Mood
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
