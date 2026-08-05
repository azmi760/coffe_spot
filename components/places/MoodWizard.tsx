'use client';

import React, { useState } from 'react';
import { DEMO_MOODS } from '@/lib/mock-data';
import { getRecommendedPlaces } from '@/lib/recommendation';
import { Place } from '@/types';
import { PlaceCard } from './PlaceCard';
import { Button } from '@/components/ui/Button';
import { Sparkles, ArrowRight, RotateCcw, CheckCircle2, Target, Users, Heart, Camera, VolumeX, Moon, BookOpen, Smile, Music } from 'lucide-react';

const ACTIVITIES = [
  { id: 'nugas', name: 'Mengerjakan Tugas / Skripsi', description: 'Butuh colokan & Wi-Fi kencang', icon: <BookOpen className="w-5 h-5" /> },
  { id: 'work', name: 'Bekerja Remote / WFC', description: 'Suasana kondusif & tenang', icon: <Target className="w-5 h-5" /> },
  { id: 'hangout', name: 'Nongkrong & Ngobrol', description: 'Seru bareng teman-teman', icon: <Users className="w-5 h-5" /> },
  { id: 'date', name: 'Kencan / Deep Talk', description: 'Romantis & intimate', icon: <Heart className="w-5 h-5" /> },
  { id: 'relax', name: 'Santai & Me-Time Pinggir Sungai', description: 'Nikmati kopi & outdoor', icon: <Smile className="w-5 h-5" /> },
  { id: 'photo', name: 'Foto Content / OOTD', description: 'Spot estetik instagramable', icon: <Camera className="w-5 h-5" /> },
];

const PREFERENCES = [
  { id: 'wifi', name: 'Wi-Fi Super Kencang' },
  { id: 'colokan', name: 'Banyak Colokan Listrik' },
  { id: 'outdoor', name: 'Area Outdoor Rindang' },
  { id: 'pet_friendly', name: 'Pet Friendly (Ramah Peliharaan)' },
  { id: 'late_night', name: 'Buka Sampai Malam / 24 Jam' },
];

export const MoodWizard: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [selectedMood, setSelectedMood] = useState<string>('fokus');
  const [selectedActivity, setSelectedActivity] = useState<string>('nugas');
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>(['wifi', 'colokan']);
  const [selectedCity, setSelectedCity] = useState<string>('Semua');
  const [results, setResults] = useState<Place[]>([]);

  const handleMoodSelect = (moodSlug: string) => {
    setSelectedMood(moodSlug);
  };

  const handlePrefToggle = (prefId: string) => {
    if (selectedPrefs.includes(prefId)) {
      setSelectedPrefs(selectedPrefs.filter((p) => p !== prefId));
    } else {
      setSelectedPrefs([...selectedPrefs, prefId]);
    }
  };

  const handleGenerateRecommendations = () => {
    const recs = getRecommendedPlaces({
      moodSlug: selectedMood,
      activity: selectedActivity,
      extraPreferences: selectedPrefs,
      city: selectedCity,
    });
    setResults(recs);
    setStep(4);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedMood('fokus');
    setSelectedActivity('nugas');
    setSelectedPrefs(['wifi', 'colokan']);
    setResults([]);
  };

  const selectedMoodObject = DEMO_MOODS.find((m) => m.slug === selectedMood);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Wizard Progress Bar Header */}
      <div className="flex items-center justify-between border-b border-coffee-200/80 pb-4">
        {[
          { num: 1, label: '1. Pilih Mood' },
          { num: 2, label: '2. Pilih Aktivitas' },
          { num: 3, label: '3. Preferensi' },
          { num: 4, label: '4. Hasil Rekomendasi' },
        ].map((s) => (
          <div
            key={s.num}
            className={`flex items-center gap-2 text-xs md:text-sm font-semibold transition-colors ${
              step >= s.num ? 'text-coffee-950' : 'text-coffee-400'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                step === s.num
                  ? 'bg-coffee-800 text-cream-50 ring-4 ring-coffee-100 shadow-sm'
                  : step > s.num
                  ? 'bg-emerald-600 text-white'
                  : 'bg-coffee-200 text-coffee-600'
              }`}
            >
              {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
            </div>
            <span className="hidden sm:inline">{s.label}</span>
          </div>
        ))}
      </div>

      {/* STEP 1: Select Mood */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-coffee-950">
              Bagaimana Suasana Hati Kamu Saat Ini?
            </h2>
            <p className="text-sm text-coffee-700">
              Pilih suasana hati yang paling menggambarkan kafe impianmu di Banjarmasin hari ini.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {DEMO_MOODS.map((mood) => {
              const isSelected = selectedMood === mood.slug;
              return (
                <button
                  key={mood.id}
                  type="button"
                  onClick={() => handleMoodSelect(mood.slug)}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 group ${
                    isSelected
                      ? 'bg-coffee-800 text-cream-50 border-coffee-800 shadow-warm-hover scale-105'
                      : 'bg-cream-50 text-coffee-900 border-coffee-200 hover:border-coffee-400 hover:bg-coffee-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                    isSelected ? 'bg-cream-50/20 text-cream-50' : 'bg-coffee-100 text-coffee-800'
                  }`}>
                    {mood.slug === 'santai' && <Smile className="w-5 h-5" />}
                    {mood.slug === 'fokus' && <Target className="w-5 h-5" />}
                    {mood.slug === 'nugas' && <BookOpen className="w-5 h-5" />}
                    {mood.slug === 'ngobrol' && <Users className="w-5 h-5" />}
                    {mood.slug === 'romantis' && <Heart className="w-5 h-5" />}
                    {mood.slug === 'ramai' && <Sparkles className="w-5 h-5" />}
                    {mood.slug === 'tenang' && <VolumeX className="w-5 h-5" />}
                    {mood.slug === 'live-music' && <Music className="w-5 h-5" />}
                    {mood.slug === 'estetik' && <Camera className="w-5 h-5" />}
                    {mood.slug === 'nongkrong-malam' && <Moon className="w-5 h-5" />}
                  </div>

                  <div>
                    <h3 className="font-bold text-sm mb-1 line-clamp-1">{mood.name}</h3>
                    <p className={`text-[11px] line-clamp-2 leading-tight ${isSelected ? 'text-cream-200' : 'text-coffee-600'}`}>
                      {mood.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setStep(2)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Lanjut ke Aktivitas
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: Select Activity */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-coffee-950">
              Apa Aktivitas Utama yang Akan Dilakukan?
            </h2>
            <p className="text-sm text-coffee-700">
              Mood terpilih: <strong className="text-terracotta-600">#{selectedMoodObject?.name}</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {ACTIVITIES.map((act) => {
              const isSelected = selectedActivity === act.id;
              return (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => setSelectedActivity(act.id)}
                  className={`p-4 rounded-2xl border flex items-center gap-4 text-left transition-all ${
                    isSelected
                      ? 'bg-coffee-800 text-cream-50 border-coffee-800 shadow-warm'
                      : 'bg-cream-50 text-coffee-900 border-coffee-200 hover:bg-coffee-50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-cream-50/20 text-cream-50' : 'bg-coffee-100 text-coffee-800'
                  }`}>
                    {act.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-0.5">{act.name}</h3>
                    <p className={`text-xs ${isSelected ? 'text-cream-200' : 'text-coffee-600'}`}>
                      {act.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 max-w-3xl mx-auto">
            <Button variant="outline" size="md" onClick={() => setStep(1)}>
              Kembali
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={() => setStep(3)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Lanjut ke Preferensi
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Extra Preferences & Area Banjarmasin */}
      {step === 3 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-coffee-950">
              Preferensi Fasilitas & Area Banjarmasin
            </h2>
            <p className="text-sm text-coffee-700">
              Pilih fasilitas yang wajib ada dan wilayah Banjarmasin tujuan pencarianmu.
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-6 bg-cream-50 p-6 rounded-2xl border border-coffee-200 shadow-warm">
            {/* Area Banjarmasin Selector */}
            <div>
              <label className="block text-xs font-bold text-coffee-900 uppercase tracking-wider mb-2">
                Pilih Area Wilayah Banjarmasin
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-coffee-200 bg-white text-sm text-coffee-950 focus:ring-2 focus:ring-coffee-600"
              >
                <option value="Semua">Semua Wilayah Banjarmasin</option>
                {['Banjarmasin Tengah', 'Banjarmasin Utara', 'Banjarmasin Timur', 'Banjarmasin Barat', 'Banjarmasin Selatan'].map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            {/* Checkbox Preferences */}
            <div>
              <label className="block text-xs font-bold text-coffee-900 uppercase tracking-wider mb-3">
                Fasilitas Prioritas
              </label>
              <div className="space-y-2.5">
                {PREFERENCES.map((pref) => {
                  const isChecked = selectedPrefs.includes(pref.id);
                  return (
                    <label
                      key={pref.id}
                      onClick={() => handlePrefToggle(pref.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-coffee-100 border-coffee-400 text-coffee-950 font-medium'
                          : 'bg-white border-coffee-200 text-coffee-700 hover:bg-coffee-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="w-4 h-4 text-coffee-800 rounded border-coffee-300 focus:ring-coffee-600"
                      />
                      <span className="text-sm">{pref.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 max-w-2xl mx-auto">
            <Button variant="outline" size="md" onClick={() => setStep(2)}>
              Kembali
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleGenerateRecommendations}
              leftIcon={<Sparkles className="w-5 h-5 text-amber-300" />}
            >
              Tampilkan Rekomendasi Kafe
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: Results Display */}
      {step === 4 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-coffee-900 text-cream-50 p-6 rounded-2xl shadow-warm-hover">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-terracotta-400">
                Rekomendasi Kafe Banjarmasin
              </span>
              <h2 className="font-serif text-2xl font-bold text-cream-50 mt-0.5">
                Rekomendasi Terbaik Mood #{selectedMoodObject?.name}
              </h2>
              <p className="text-xs text-coffee-200 mt-1">
                Ditemukan <strong>{results.length}</strong> tempat nongkrong di Banjarmasin yang paling cocok dengan preferensimu.
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-4 h-4" />}>
              Cari Mood Lain
            </Button>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((place) => (
                <PlaceCard key={place.id} place={place} showMatchScore={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-cream-50 rounded-2xl border border-coffee-200">
              <p className="text-coffee-700 text-sm">Tidak ditemukan kafe yang cocok di {selectedCity}.</p>
              <Button variant="outline" size="sm" onClick={handleReset} className="mt-4">
                Coba Ubah Filter Area
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
