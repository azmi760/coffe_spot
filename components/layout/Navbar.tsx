'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Coffee, Heart, Compass, Sparkles, Menu, X, MapPin, PlusCircle } from 'lucide-react';

export const Navbar = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Beranda', href: '/', icon: <Coffee className="w-4 h-4" /> },
    { name: 'Jelajahi Kafe', href: '/jelajahi', icon: <Compass className="w-4 h-4" /> },
    { name: 'Cari Mood', href: '/rekomendasi', icon: <Sparkles className="w-4 h-4" /> },
    { name: 'Favorit Saya', href: '/favorit', icon: <Heart className="w-4 h-4" /> },
    { name: 'Manajemen Kafe', href: '/admin', icon: <PlusCircle className="w-4 h-4" /> },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-cream-50/90 backdrop-blur-xl border-b border-coffee-200/80 shadow-warm py-3'
          : 'bg-cream-50/70 backdrop-blur-md py-4 border-b border-coffee-100/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo with Glowing Accent */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-coffee-900 via-coffee-800 to-terracotta-500 flex items-center justify-center text-cream-50 shadow-glow-terracotta group-hover:scale-105 transition-transform duration-300">
            <Coffee className="w-6 h-6 text-amber-300" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-extrabold text-2xl text-coffee-950 tracking-tight leading-none">
              Coffe<span className="text-terracotta-500">Spot</span>
            </span>
            <span className="text-[10px] font-bold tracking-widest uppercase text-coffee-600 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-terracotta-500 inline" /> Banjarmasin Cafe Guide
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-coffee-100/80 p-1.5 rounded-full border border-coffee-200/80 backdrop-blur-md shadow-sm">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-coffee-900 to-coffee-800 text-cream-50 shadow-md scale-105'
                    : 'text-coffee-800 hover:text-coffee-950 hover:bg-cream-50/80'
                }`}
              >
                <span className={isActive ? 'text-amber-300' : 'text-coffee-600'}>
                  {link.icon}
                </span>
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
          className="md:hidden p-2.5 rounded-xl bg-coffee-100/80 text-coffee-900 hover:bg-coffee-200 focus:outline-none transition-colors border border-coffee-200"
        >
          {mobileMenuOpen ? <X className="w-6 h-6 text-terracotta-500" /> : <Menu className="w-6 h-6 text-coffee-800" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-cream-50/95 backdrop-blur-2xl border-b border-coffee-200 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-300 shadow-xl">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-coffee-900 to-coffee-800 text-cream-50 shadow-warm'
                      : 'text-coffee-900 hover:bg-coffee-100'
                  }`}
                >
                  <span className={isActive ? 'text-amber-300' : 'text-coffee-600'}>{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};
