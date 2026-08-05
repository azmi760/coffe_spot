import React from 'react';
import { MoodWizard } from '@/components/places/MoodWizard';
import { Sparkles } from 'lucide-react';

export default function RekomendasiPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta-500/10 text-terracotta-600 text-xs font-bold border border-terracotta-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Sistem Rekomendasi Pintar</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-coffee-950">
          Rekomendasi Berdasarkan Mood
        </h1>
        <p className="text-sm text-coffee-700 leading-relaxed">
          Pilih suasana hati, aktivitas, dan preferensi unik kamu. Sistem kami akan menghitung tingkat kecocokan tempat secara otomatis!
        </p>
      </div>

      <MoodWizard />
    </div>
  );
}
