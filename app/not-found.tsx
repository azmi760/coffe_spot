import React from 'react';
import Link from 'next/link';
import { Coffee, Home, Compass } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md space-y-6 bg-cream-50 p-8 rounded-3xl border border-coffee-200 shadow-warm">
        <div className="w-16 h-16 rounded-2xl bg-coffee-100 flex items-center justify-center mx-auto text-coffee-800">
          <Coffee className="w-8 h-8 text-terracotta-500" />
        </div>
        <div className="space-y-2">
          <span className="font-mono text-xs font-bold uppercase text-terracotta-600">Error 404</span>
          <h1 className="font-serif text-3xl font-bold text-coffee-950">Halaman Tidak Ditemukan</h1>
          <p className="text-xs text-coffee-700 leading-relaxed">
            Maaf, halaman atau tempat nongkrong yang kamu cari mungkin sudah dipindahkan atau tidak tersedia.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
          <Link href="/">
            <Button variant="primary" size="sm" className="w-full sm:w-auto" leftIcon={<Home className="w-4 h-4" />}>
              Kembali ke Beranda
            </Button>
          </Link>
          <Link href="/jelajahi">
            <Button variant="outline" size="sm" className="w-full sm:w-auto" leftIcon={<Compass className="w-4 h-4" />}>
              Jelajahi Tempat
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
