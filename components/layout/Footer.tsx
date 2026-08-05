import React from 'react';
import Link from 'next/link';
import { Coffee, Heart, MapPin, Mail, Instagram, Facebook, Twitter, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-coffee-950 via-coffee-900 to-coffee-950 text-cream-100 pt-16 pb-12 border-t border-coffee-800 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-terracotta-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-coffee-800 to-terracotta-500 flex items-center justify-center text-cream-50 shadow-glow-terracotta">
                <Coffee className="w-6 h-6 text-amber-300" />
              </div>
              <span className="font-serif font-extrabold text-2xl text-cream-50 tracking-tight">
                Coffe<span className="text-terracotta-500">Spot</span>
              </span>
            </Link>
            <p className="text-xs text-coffee-300 leading-relaxed font-medium">
              Platform pintar rekomendasi tempat nongkrong, coffee shop artisan, dan kafe santai terbaik di Kota Banjarmasin sesuai dengan mood dan aktivitas kamu.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-xl bg-coffee-900 border border-coffee-800 flex items-center justify-center text-coffee-300 hover:text-terracotta-500 hover:border-terracotta-500 hover:scale-110 transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-coffee-900 border border-coffee-800 flex items-center justify-center text-coffee-300 hover:text-terracotta-500 hover:border-terracotta-500 hover:scale-110 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-coffee-900 border border-coffee-800 flex items-center justify-center text-coffee-300 hover:text-terracotta-500 hover:border-terracotta-500 hover:scale-110 transition-all">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-lg font-bold text-cream-50 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" /> Navigasi Utama
            </h4>
            <ul className="space-y-2.5 text-xs text-coffee-300 font-medium">
              <li>
                <Link href="/" className="hover:text-cream-50 hover:translate-x-1 inline-block transition-all">Beranda</Link>
              </li>
              <li>
                <Link href="/jelajahi" className="hover:text-cream-50 hover:translate-x-1 inline-block transition-all">Jelajahi Kafe Banjarmasin</Link>
              </li>
              <li>
                <Link href="/rekomendasi" className="hover:text-cream-50 hover:translate-x-1 inline-block transition-all">Cari Sesuai Mood</Link>
              </li>
              <li>
                <Link href="/favorit" className="hover:text-cream-50 hover:translate-x-1 inline-block transition-all">Tempat Favorit Saya</Link>
              </li>
            </ul>
          </div>

          {/* Popular Moods */}
          <div className="space-y-3">
            <h4 className="font-serif text-lg font-bold text-cream-50">Suasana / Mood</h4>
            <ul className="space-y-2.5 text-xs text-coffee-300 font-medium">
              <li>
                <Link href="/rekomendasi?mood=fokus" className="hover:text-cream-50 transition-colors">Fokus &amp; Nugas Space</Link>
              </li>
              <li>
                <Link href="/rekomendasi?mood=santai" className="hover:text-cream-50 transition-colors">Santai Pinggir Sungai</Link>
              </li>
              <li>
                <Link href="/rekomendasi?mood=romantis" className="hover:text-cream-50 transition-colors">Suasana Romantis</Link>
              </li>
              <li>
                <Link href="/rekomendasi?mood=estetik" className="hover:text-cream-50 transition-colors">Spot Foto Estetik</Link>
              </li>
              <li>
                <Link href="/rekomendasi?mood=nongkrong-malam" className="hover:text-cream-50 transition-colors">Kafe 24 Jam Banjar</Link>
              </li>
            </ul>
          </div>

          {/* Banjarmasin Areas */}
          <div className="space-y-3">
            <h4 className="font-serif text-lg font-bold text-cream-50">Area Banjarmasin</h4>
            <div className="flex flex-wrap gap-2 text-[11px]">
              {[
                'Banjarmasin Tengah',
                'Banjarmasin Utara',
                'Banjarmasin Timur',
                'Banjarmasin Barat',
                'Banjarmasin Selatan',
                'Siring Tendean',
                'Kayutangi',
                'Sultan Adam',
              ].map((area) => (
                <Link
                  key={area}
                  href={`/jelajahi?city=${encodeURIComponent(area)}`}
                  className="px-3 py-1.5 rounded-xl bg-coffee-900 border border-coffee-800 text-coffee-300 hover:text-cream-50 hover:bg-terracotta-500 hover:border-terracotta-500 transition-all font-semibold"
                >
                  {area}
                </Link>
              ))}
            </div>
            <div className="pt-3 text-xs text-coffee-400 space-y-1.5">
              <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-terracotta-500" /> Banjarmasin, Kalimantan Selatan</p>
              <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-amber-500" /> info@coffespot.id</p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-coffee-900 flex flex-col sm:flex-row items-center justify-between text-xs text-coffee-400 gap-4">
          <p>© {new Date().getFullYear()} CoffeSpot Banjarmasin. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-coffee-300 font-semibold">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-terracotta-500 fill-terracotta-500 animate-pulse" />
            <span>khusus pencinta kopi &amp; nongkrong Banjarmasin.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
