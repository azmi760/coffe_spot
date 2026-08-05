'use client';

import React from 'react';
import { Coffee, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md space-y-6 bg-cream-50 p-8 rounded-3xl border border-coffee-200 shadow-warm">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto text-red-600">
          <Coffee className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-2xl font-bold text-coffee-950">Terjadi Kesalahan Server</h1>
          <p className="text-xs text-coffee-700 leading-relaxed">
            Terjadi masalah teknis saat memuat data. Silakan coba muat ulang halaman.
          </p>
        </div>
        <div className="flex justify-center pt-2">
          <Button variant="primary" size="md" onClick={() => reset()} leftIcon={<RotateCcw className="w-4 h-4" />}>
            Coba Coba Muat Ulang
          </Button>
        </div>
      </div>
    </div>
  );
}
