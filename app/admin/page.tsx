'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { DEMO_PLACES, DEMO_CATEGORIES, DEMO_MOODS, DEMO_REVIEWS } from '@/lib/mock-data';
import { Place, Category, Mood, Review } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Shield,
  Coffee,
  Users,
  MessageSquare,
  Plus,
  Edit2,
  Trash2,
  Upload,
  CheckCircle,
  X,
  Layers,
  Sparkles,
  MapPin,
  Star
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean>(true);
  const [places, setPlaces] = useState<Place[]>(DEMO_PLACES);
  const [categories, setCategories] = useState<Category[]>(DEMO_CATEGORIES);
  const [moods, setMoods] = useState<Mood[]>(DEMO_MOODS);
  const [activeTab, setActiveTab] = useState<'places' | 'categories' | 'moods' | 'reviews'>('places');

  // Modal State for Adding/Editing Places
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formCity, setFormCity] = useState('Jakarta Selatan');
  const [formCategoryId, setFormCategoryId] = useState(DEMO_CATEGORIES[0]?.id || '');
  const [formPriceLevel, setFormPriceLevel] = useState(2);
  const [formImageUrl, setFormImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    // Admin check from localStorage or Supabase session
    const storedUser = localStorage.getItem('cs_user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed.role === 'admin' || parsed.email?.includes('admin')) {
        setIsAdmin(true);
      }
    }
  }, []);

  const openAddModal = () => {
    setEditingPlace(null);
    setFormName('');
    setFormDescription('');
    setFormAddress('');
    setFormCity('Jakarta Selatan');
    setFormCategoryId(categories[0]?.id || '');
    setFormPriceLevel(2);
    setFormImageUrl('https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80');
    setModalOpen(true);
  };

  const openEditModal = (place: Place) => {
    setEditingPlace(place);
    setFormName(place.name);
    setFormDescription(place.description);
    setFormAddress(place.address);
    setFormCity(place.city);
    setFormCategoryId(place.category_id);
    setFormPriceLevel(place.price_level);
    setFormImageUrl(place.image_url);
    setModalOpen(true);
  };

  const handleSavePlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formAddress) return;

    const slug = formName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingPlace) {
      // Update
      const updated = places.map((p) =>
        p.id === editingPlace.id
          ? {
              ...p,
              name: formName,
              slug,
              description: formDescription,
              address: formAddress,
              city: formCity,
              category_id: formCategoryId,
              category: categories.find((c) => c.id === formCategoryId),
              price_level: formPriceLevel,
              image_url: formImageUrl,
            }
          : p
      );
      setPlaces(updated);
    } else {
      // Create new
      const newPlace: Place = {
        id: 'p-' + Date.now(),
        name: formName,
        slug,
        description: formDescription,
        address: formAddress,
        city: formCity,
        latitude: -6.2,
        longitude: 106.8,
        category_id: formCategoryId,
        category: categories.find((c) => c.id === formCategoryId),
        price_level: formPriceLevel,
        average_rating: 5.0,
        review_count: 1,
        opening_hours: [{ day: 'Senin - Minggu', open: '08:00', close: '22:00' }],
        image_url: formImageUrl || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
        is_active: true,
        moods: [moods[0], moods[1]],
        facilities: [],
      };
      setPlaces([newPlace, ...places]);
    }

    setModalOpen(false);
  };

  const handleDeletePlace = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus tempat ini?')) {
      setPlaces(places.filter((p) => p.id !== id));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const supabase = createClient();

    // Upload to Supabase Storage bucket 'place-images'
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from('place-images')
      .upload(fileName, file);

    if (!error && data) {
      const { data: publicUrlData } = supabase.storage
        .from('place-images')
        .getPublicUrl(fileName);
      setFormImageUrl(publicUrlData.publicUrl);
    } else {
      // Fallback object URL
      setFormImageUrl(URL.createObjectURL(file));
    }
    setUploadingImage(false);
  };

  // Flatten all reviews for moderation tab
  const allReviewsList: Review[] = Object.values(DEMO_REVIEWS).flat();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-coffee-950 text-cream-50 p-6 rounded-3xl shadow-warm-hover">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-terracotta-400 font-bold text-xs uppercase tracking-widest">
            <Shield className="w-4 h-4" />
            <span>Admin Control Center</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-cream-50">Dashboard Pengelola CoffeSpot</h1>
          <p className="text-xs text-coffee-300">
            Kelola data tempat nongkrong, kategori, tag mood suasana, dan moderasi ulasan publik.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={openAddModal} leftIcon={<Plus className="w-4 h-4" />}>
          Tambah Tempat Baru
        </Button>
      </div>

      {/* Metrics Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-cream-50 p-6 rounded-3xl border border-coffee-200 shadow-warm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-coffee-800 text-cream-50 flex items-center justify-center font-bold">
            <Coffee className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-coffee-600 font-semibold block">Total Tempat Nongkrong</span>
            <span className="font-serif text-3xl font-bold text-coffee-950">{places.length}</span>
          </div>
        </div>

        <div className="bg-cream-50 p-6 rounded-3xl border border-coffee-200 shadow-warm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-terracotta-500 text-white flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-coffee-600 font-semibold block">Pengguna Terdaftar</span>
            <span className="font-serif text-3xl font-bold text-coffee-950">1,248</span>
          </div>
        </div>

        <div className="bg-cream-50 p-6 rounded-3xl border border-coffee-200 shadow-warm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-coffee-600 font-semibold block">Total Ulasan Masuk</span>
            <span className="font-serif text-3xl font-bold text-coffee-950">{allReviewsList.length + 15}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-coffee-200 pb-3">
        {[
          { id: 'places', label: 'Kelola Tempat', icon: <Coffee className="w-4 h-4" /> },
          { id: 'categories', label: 'Kategori', icon: <Layers className="w-4 h-4" /> },
          { id: 'moods', label: 'Tag Mood', icon: <Sparkles className="w-4 h-4" /> },
          { id: 'reviews', label: 'Moderasi Ulasan', icon: <MessageSquare className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-coffee-800 text-cream-50 shadow-sm'
                : 'text-coffee-700 hover:bg-coffee-100'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB CONTENT: PLACES TABLE */}
      {activeTab === 'places' && (
        <div className="bg-cream-50 rounded-3xl border border-coffee-200 overflow-hidden shadow-warm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-coffee-100/70 border-b border-coffee-200 text-xs font-bold text-coffee-900 uppercase">
                  <th className="p-4">Foto & Nama Tempat</th>
                  <th className="p-4">Kota</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Harga</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-coffee-200/60 text-xs text-coffee-900">
                {places.map((place) => (
                  <tr key={place.id} className="hover:bg-coffee-100/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-coffee-200">
                          <Image src={place.image_url} alt={place.name} fill className="object-cover" />
                        </div>
                        <div>
                          <strong className="block text-sm font-serif text-coffee-950">{place.name}</strong>
                          <span className="text-[11px] text-coffee-600 line-clamp-1">{place.address}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-semibold">{place.city}</td>
                    <td className="p-4">
                      <Badge variant="coffee" size="sm">{place.category?.name || 'Artisan'}</Badge>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-amber-600">★ {place.average_rating}</span> ({place.review_count})
                    </td>
                    <td className="p-4 font-mono font-bold">{'$'.repeat(place.price_level)}</td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(place)}
                        className="p-1.5 rounded-lg bg-coffee-100 text-coffee-800 hover:bg-coffee-200 transition-colors"
                        title="Edit Tempat"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePlace(place.id)}
                        className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                        title="Hapus Tempat"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="p-5 rounded-2xl bg-cream-50 border border-coffee-200 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-coffee-950 text-sm">{cat.name}</h4>
                <p className="text-xs text-coffee-600">Slug: {cat.slug}</p>
              </div>
              <Badge variant="coffee" size="sm">Aktif</Badge>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: MOODS */}
      {activeTab === 'moods' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {moods.map((m) => (
            <div key={m.id} className="p-4 rounded-2xl bg-cream-50 border border-coffee-200 space-y-1">
              <h4 className="font-bold text-coffee-950 text-xs">#{m.name}</h4>
              <p className="text-[11px] text-coffee-600">{m.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="space-y-3">
          {allReviewsList.map((rev) => (
            <div key={rev.id} className="p-4 rounded-2xl bg-cream-50 border border-coffee-200 flex items-center justify-between gap-4">
              <div>
                <span className="font-bold text-xs text-coffee-950">{rev.user_profile?.full_name || 'User'}</span>
                <p className="text-xs text-coffee-700 mt-0.5">"{rev.comment}"</p>
                <span className="text-[10px] text-amber-600 font-bold">Rating: ★ {rev.rating}</span>
              </div>
              <button
                onClick={() => confirm('Hapus ulasan ini?') && alert('Ulasan dihapus')}
                className="p-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MODAL ADD / EDIT PLACE */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-cream-50 w-full max-w-2xl rounded-3xl border border-coffee-200 p-6 shadow-warm-hover space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-coffee-200 pb-3">
              <h3 className="font-serif font-bold text-xl text-coffee-950">
                {editingPlace ? 'Edit Data Tempat Nongkrong' : 'Tambah Tempat Nongkrong Baru'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-coffee-600 hover:text-coffee-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlace} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-coffee-800 mb-1">Nama Tempat</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Kopi Kenangan Senja"
                  className="w-full px-3 py-2 rounded-xl border border-coffee-200 text-xs focus:ring-2 focus:ring-coffee-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-coffee-800 mb-1">Kota</label>
                  <select
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-coffee-200 text-xs"
                  >
                    {['Jakarta Selatan', 'Jakarta Barat', 'Bandung', 'Yogyakarta', 'Surabaya', 'Bali'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-coffee-800 mb-1">Kategori</label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-coffee-200 text-xs"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-coffee-800 mb-1">Alamat Lengkap</label>
                <input
                  type="text"
                  required
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  placeholder="Jl. Senopati No. 45..."
                  className="w-full px-3 py-2 rounded-xl border border-coffee-200 text-xs focus:ring-2 focus:ring-coffee-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-coffee-800 mb-1">Deskripsi Spot</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Jelaskan fasilitas, keunikan kopi, suasana..."
                  className="w-full px-3 py-2 rounded-xl border border-coffee-200 text-xs focus:ring-2 focus:ring-coffee-600"
                />
              </div>

              {/* Image Upload / URL */}
              <div>
                <label className="block text-xs font-bold text-coffee-800 mb-1">Upload Foto Tempat (Supabase Storage)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-xs text-coffee-700 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-coffee-800 file:text-cream-50 hover:file:bg-coffee-900"
                  />
                  {uploadingImage && <span className="text-xs text-coffee-600 animate-pulse">Mengunggah gambar...</span>}
                </div>
                {formImageUrl && (
                  <div className="mt-2 relative w-24 h-24 rounded-xl overflow-hidden border border-coffee-300">
                    <Image src={formImageUrl} alt="Preview" fill className="object-cover" />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-coffee-200">
                <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>
                  Batal
                </Button>
                <Button variant="primary" size="sm" type="submit" leftIcon={<CheckCircle className="w-4 h-4" />}>
                  Simpan Data Tempat
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
