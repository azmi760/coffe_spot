'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { DEMO_PLACES, DEMO_CATEGORIES, DEMO_MOODS, DEMO_REVIEWS, DEMO_FACILITIES } from '@/lib/mock-data';
import { Place, Category, Mood, Review, MenuItem, Facility } from '@/types';
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
  Star,
  Utensils,
  Smartphone,
  Instagram,
  PlusCircle,
  Clock,
  CheckSquare,
  Square
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean>(true);
  const [places, setPlaces] = useState<Place[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEMO_CATEGORIES);
  const [moods, setMoods] = useState<Mood[]>(DEMO_MOODS);
  const [facilities, setFacilities] = useState<Facility[]>(DEMO_FACILITIES);
  const [activeTab, setActiveTab] = useState<'places' | 'categories' | 'moods' | 'reviews'>('places');

  // Modal State for Adding/Editing Places
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formCity, setFormCity] = useState('Banjarmasin Utara');
  const [formCategoryId, setFormCategoryId] = useState(DEMO_CATEGORIES[0]?.id || '');
  const [formPriceLevel, setFormPriceLevel] = useState(2);
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formLatitude, setFormLatitude] = useState(-3.3194);
  const [formLongitude, setFormLongitude] = useState(114.5908);
  const [formPhoneNumber, setFormPhoneNumber] = useState('');
  const [formInstagram, setFormInstagram] = useState('');
  const [formOpenHour, setFormOpenHour] = useState('08:00');
  const [formCloseHour, setFormCloseHour] = useState('23:00');
  const [formFacilities, setFormFacilities] = useState<string[]>([]);
  const [formMenuItems, setFormMenuItems] = useState<MenuItem[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Menu Form Inputs (for adding new menu items into the place)
  const [menuName, setMenuName] = useState('');
  const [menuCategory, setMenuCategory] = useState<'Kopi' | 'Non-Kopi' | 'Makanan' | 'Dessert'>('Kopi');
  const [menuPrice, setMenuPrice] = useState<number>(25000);
  const [menuDesc, setMenuDesc] = useState('');
  const [menuRecommended, setMenuRecommended] = useState(false);

  useEffect(() => {
    // Load places from localStorage if exists, fallback to DEMO_PLACES
    const storedPlaces = localStorage.getItem('cs_places');
    if (storedPlaces) {
      try {
        setPlaces(JSON.parse(storedPlaces));
      } catch (e) {
        setPlaces(DEMO_PLACES);
      }
    } else {
      setPlaces(DEMO_PLACES);
    }
  }, []);

  const savePlacesToStorage = (newPlacesList: Place[]) => {
    setPlaces(newPlacesList);
    localStorage.setItem('cs_places', JSON.stringify(newPlacesList));
  };

  const openAddModal = () => {
    setEditingPlace(null);
    setFormName('');
    setFormDescription('');
    setFormAddress('');
    setFormCity('Banjarmasin Utara');
    setFormCategoryId(categories[0]?.id || '');
    setFormPriceLevel(2);
    setFormImageUrl('https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80');
    setFormLatitude(-3.3194);
    setFormLongitude(114.5908);
    setFormPhoneNumber('081234567890');
    setFormInstagram('@kopispot.bjm');
    setFormOpenHour('08:00');
    setFormCloseHour('23:00');
    setFormFacilities([facilities[0].id, facilities[1].id]);
    setFormMenuItems([
      { id: 'm-1', name: 'Es Kopi Susu Aren', category: 'Kopi', price: 22000, description: 'Kopi manis legit rasa gula aren asli', is_recommended: true },
      { id: 'm-2', name: 'Americano Ice', category: 'Kopi', price: 18000, description: 'Double shot espresso dingin segar' },
      { id: 'm-3', name: 'French Fries Cheese', category: 'Makanan', price: 25000, description: 'Kentang goreng bumbu keju renyah' }
    ]);
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
    setFormLatitude(place.latitude || -3.3194);
    setFormLongitude(place.longitude || 114.5908);
    setFormPhoneNumber(place.phone_number || '');
    setFormInstagram(place.instagram || '');
    setFormOpenHour(place.opening_hours?.[0]?.open || '08:00');
    setFormCloseHour(place.opening_hours?.[0]?.close || '23:00');
    setFormFacilities(place.facilities?.map((f) => f.id) || []);
    setFormMenuItems(place.menu_items || []);
    setModalOpen(true);
  };

  const handleAddMenuItem = () => {
    if (!menuName.trim()) return;
    const newItem: MenuItem = {
      id: 'item-' + Date.now(),
      name: menuName,
      category: menuCategory,
      price: Number(menuPrice) || 0,
      description: menuDesc,
      is_recommended: menuRecommended
    };
    setFormMenuItems([...formMenuItems, newItem]);
    setMenuName('');
    setMenuDesc('');
    setMenuPrice(25000);
    setMenuRecommended(false);
  };

  const handleRemoveMenuItem = (itemId: string) => {
    setFormMenuItems(formMenuItems.filter((i) => i.id !== itemId));
  };

  const toggleFacility = (facilityId: string) => {
    if (formFacilities.includes(facilityId)) {
      setFormFacilities(formFacilities.filter((id) => id !== facilityId));
    } else {
      setFormFacilities([...formFacilities, facilityId]);
    }
  };

  const handleSavePlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formAddress) return;

    const slug = formName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const selectedCategory = categories.find((c) => c.id === formCategoryId);
    const selectedFacilities = facilities.filter((f) => formFacilities.includes(f.id));

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
              latitude: Number(formLatitude),
              longitude: Number(formLongitude),
              category_id: formCategoryId,
              category: selectedCategory,
              price_level: formPriceLevel,
              image_url: formImageUrl,
              phone_number: formPhoneNumber,
              instagram: formInstagram,
              opening_hours: [{ day: 'Senin - Minggu', open: formOpenHour, close: formCloseHour }],
              facilities: selectedFacilities,
              menu_items: formMenuItems,
            }
          : p
      );
      savePlacesToStorage(updated);
    } else {
      // Create new
      const newPlace: Place = {
        id: 'p-' + Date.now(),
        name: formName,
        slug,
        description: formDescription,
        address: formAddress,
        city: formCity,
        latitude: Number(formLatitude),
        longitude: Number(formLongitude),
        category_id: formCategoryId,
        category: selectedCategory,
        price_level: formPriceLevel,
        average_rating: 5.0,
        review_count: 1,
        opening_hours: [{ day: 'Senin - Minggu', open: formOpenHour, close: formCloseHour }],
        image_url: formImageUrl || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
        is_active: true,
        phone_number: formPhoneNumber,
        instagram: formInstagram,
        facilities: selectedFacilities,
        menu_items: formMenuItems,
        moods: [moods[0], moods[1]],
      };
      savePlacesToStorage([newPlace, ...places]);
    }

    setModalOpen(false);
  };

  const handleDeletePlace = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus tempat toko kopi ini?')) {
      const updated = places.filter((p) => p.id !== id);
      savePlacesToStorage(updated);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const supabase = createClient();

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
      setFormImageUrl(URL.createObjectURL(file));
    }
    setUploadingImage(false);
  };

  const allReviewsList: Review[] = Object.values(DEMO_REVIEWS).flat();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-coffee-950 text-cream-50 p-6 sm:p-8 rounded-3xl shadow-warm-hover relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 text-terracotta-400 font-bold text-xs uppercase tracking-widest">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Manajemen Toko Kopi CoffeSpot</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cream-50">
            Pusat Pengelolaan Toko & Menu Kopi
          </h1>
          <p className="text-xs sm:text-sm text-coffee-300 max-w-2xl leading-relaxed">
            Tambahkan tempat toko kopi baru, atur daftar menu minuman/makanan, atur fasilitas, alamat presisi Google Maps, dan jam operasional.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={openAddModal}
          leftIcon={<PlusCircle className="w-5 h-5 text-amber-300" />}
          className="relative z-10 shadow-glow-terracotta"
        >
          Tambah Toko Kopi Baru
        </Button>
      </div>

      {/* Metrics Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-cream-50 p-6 rounded-3xl border border-coffee-200 shadow-warm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-coffee-800 text-cream-50 flex items-center justify-center font-bold shadow-md">
            <Coffee className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <span className="text-xs text-coffee-600 font-semibold block">Total Toko Kopi Aktif</span>
            <span className="font-serif text-3xl font-bold text-coffee-950">{places.length}</span>
          </div>
        </div>

        <div className="bg-cream-50 p-6 rounded-3xl border border-coffee-200 shadow-warm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-terracotta-500 text-white flex items-center justify-center font-bold shadow-md">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-coffee-600 font-semibold block">Total Menu Terdaftar</span>
            <span className="font-serif text-3xl font-bold text-coffee-950">
              {places.reduce((acc, p) => acc + (p.menu_items?.length || 0), 0)}
            </span>
          </div>
        </div>

        <div className="bg-cream-50 p-6 rounded-3xl border border-coffee-200 shadow-warm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-coffee-600 font-semibold block">Total Ulasan Komunitas</span>
            <span className="font-serif text-3xl font-bold text-coffee-950">{allReviewsList.length + 15}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-coffee-200 pb-3 overflow-x-auto">
        {[
          { id: 'places', label: 'Daftar & Manajemen Toko Kopi', icon: <Coffee className="w-4 h-4" /> },
          { id: 'categories', label: 'Kategori Kafe', icon: <Layers className="w-4 h-4" /> },
          { id: 'moods', label: 'Tag Suasana Mood', icon: <Sparkles className="w-4 h-4" /> },
          { id: 'reviews', label: 'Moderasi Ulasan', icon: <MessageSquare className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
              activeTab === tab.id
                ? 'bg-coffee-900 text-cream-50 shadow-md'
                : 'text-coffee-700 hover:bg-coffee-100/80'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB CONTENT: PLACES TABLE & MANAGEMENT */}
      {activeTab === 'places' && (
        <div className="bg-cream-50 rounded-3xl border border-coffee-200 overflow-hidden shadow-warm space-y-4 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-coffee-200 pb-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-coffee-950">Daftar Toko Kopi</h3>
              <p className="text-xs text-coffee-600">Klik tombol Edit untuk memperbarui menu, foto, atau lokasi toko kopi.</p>
            </div>
            <Button variant="primary" size="sm" onClick={openAddModal} leftIcon={<Plus className="w-4 h-4" />}>
              + Tambah Toko Baru
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-coffee-100/70 border-b border-coffee-200 text-xs font-bold text-coffee-900 uppercase">
                  <th className="p-4">Foto & Toko Kopi</th>
                  <th className="p-4">Kota / Area</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Jumlah Menu</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-coffee-200/60 text-xs text-coffee-900">
                {places.map((place) => (
                  <tr key={place.id} className="hover:bg-coffee-100/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 bg-coffee-200 border border-coffee-300">
                          <Image src={place.image_url} alt={place.name} fill className="object-cover" />
                        </div>
                        <div>
                          <strong className="block text-sm font-serif text-coffee-950">{place.name}</strong>
                          <span className="text-[11px] text-coffee-600 line-clamp-1">{place.address}</span>
                          {place.instagram && (
                            <span className="text-[10px] text-terracotta-600 font-semibold block">{place.instagram}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-semibold">{place.city}</td>
                    <td className="p-4">
                      <Badge variant="coffee" size="sm">{place.category?.name || 'Coffee Shop'}</Badge>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-coffee-950 bg-coffee-100 px-2.5 py-1 rounded-full text-[11px]">
                        {place.menu_items?.length || 0} Menu
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-amber-600">★ {place.average_rating}</span> ({place.review_count})
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(place)}
                        className="p-2 rounded-xl bg-coffee-100 text-coffee-900 hover:bg-coffee-200 transition-colors font-bold inline-flex items-center gap-1"
                        title="Edit Toko & Menu"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit / Menu</span>
                      </button>
                      <button
                        onClick={() => handleDeletePlace(place.id)}
                        className="p-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                        title="Hapus Tempat"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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

      {/* COMPREHENSIVE MODAL FOR ADDING / EDITING COFFEE SHOP & MENUS */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-cream-50 w-full max-w-3xl rounded-3xl border border-coffee-200 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-coffee-200 pb-4">
              <div>
                <h3 className="font-serif font-bold text-2xl text-coffee-950">
                  {editingPlace ? 'Edit Data Toko Kopi & Menu' : 'Tambah Toko Kopi Baru'}
                </h3>
                <p className="text-xs text-coffee-600">Lengkapi data toko kopi, alamat presisi, fasilitas, dan daftar menu.</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-2 rounded-full text-coffee-600 hover:bg-coffee-100">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSavePlace} className="space-y-6">
              {/* SECTION 1: BASIC SHOP INFO */}
              <div className="space-y-4 bg-white p-5 rounded-2xl border border-coffee-200/80">
                <h4 className="font-serif font-bold text-sm text-coffee-950 flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-terracotta-500" /> 1. Informasi Utama Toko Kopi
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-coffee-800 mb-1">Nama Toko Kopi *</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Contoh: Nordu Coffee & Eatery"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 text-xs focus:ring-2 focus:ring-coffee-600 bg-cream-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-coffee-800 mb-1">Kategori Kafe *</label>
                    <select
                      value={formCategoryId}
                      onChange={(e) => setFormCategoryId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 text-xs bg-cream-50/50 font-medium"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-coffee-800 mb-1">Wilayah / Kota *</label>
                    <select
                      value={formCity}
                      onChange={(e) => setFormCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 text-xs bg-cream-50/50 font-medium"
                    >
                      {['Banjarmasin Utara', 'Banjarmasin Timur', 'Banjarmasin Barat', 'Banjarmasin Selatan', 'Banjarmasin Tengah', 'Jakarta Selatan', 'Bandung', 'Yogyakarta'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-coffee-800 mb-1">Level Harga</label>
                    <select
                      value={formPriceLevel}
                      onChange={(e) => setFormPriceLevel(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 text-xs bg-cream-50/50 font-mono font-bold"
                    >
                      <option value={1}>$ (Terjangkau ~Rp15k-25k)</option>
                      <option value={2}>$$ (Sedang ~Rp25k-40k)</option>
                      <option value={3}>$$$ (Premium ~Rp40k-65k)</option>
                      <option value={4}>$$$$ (Artisan / Luxury)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-coffee-800 mb-1">Jam Buka - Tutup</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={formOpenHour}
                        onChange={(e) => setFormOpenHour(e.target.value)}
                        placeholder="08:00"
                        className="w-full px-2.5 py-2 rounded-xl border border-coffee-200 text-xs text-center font-mono bg-cream-50/50"
                      />
                      <span className="text-xs text-coffee-600">-</span>
                      <input
                        type="text"
                        value={formCloseHour}
                        onChange={(e) => setFormCloseHour(e.target.value)}
                        placeholder="23:00"
                        className="w-full px-2.5 py-2 rounded-xl border border-coffee-200 text-xs text-center font-mono bg-cream-50/50"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-coffee-800 mb-1">Alamat Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    placeholder="Jl. A. Yani Km 3.5 No. 48, Karang Mekar..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 text-xs focus:ring-2 focus:ring-coffee-600 bg-cream-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-coffee-800 mb-1">Deskripsi Lengkap & Keunikan Toko Kopi</label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Ceritakan keistimewaan racikan kopi, suasana indoor/outdoor, konsep desain..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-coffee-200 text-xs focus:ring-2 focus:ring-coffee-600 bg-cream-50/50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-coffee-800 mb-1 flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5 text-coffee-600" /> Nomor WhatsApp / Telp Kasir
                    </label>
                    <input
                      type="text"
                      value={formPhoneNumber}
                      onChange={(e) => setFormPhoneNumber(e.target.value)}
                      placeholder="081234567890"
                      className="w-full px-3.5 py-2 rounded-xl border border-coffee-200 text-xs font-mono bg-cream-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-coffee-800 mb-1 flex items-center gap-1">
                      <Instagram className="w-3.5 h-3.5 text-terracotta-500" /> Akun Instagram
                    </label>
                    <input
                      type="text"
                      value={formInstagram}
                      onChange={(e) => setFormInstagram(e.target.value)}
                      placeholder="@namatokokopi"
                      className="w-full px-3.5 py-2 rounded-xl border border-coffee-200 text-xs bg-cream-50/50"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: MAP LOCATION COORDINATES */}
              <div className="space-y-3 bg-white p-5 rounded-2xl border border-coffee-200/80">
                <h4 className="font-serif font-bold text-sm text-coffee-950 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-terracotta-500" /> 2. Koordinat Lokasi Google Maps Presisi
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-coffee-800 mb-1">Latitude (Garis Lintang)</label>
                    <input
                      type="number"
                      step="any"
                      value={formLatitude}
                      onChange={(e) => setFormLatitude(parseFloat(e.target.value))}
                      placeholder="-3.335500"
                      className="w-full px-3.5 py-2 rounded-xl border border-coffee-200 text-xs font-mono bg-cream-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-coffee-800 mb-1">Longitude (Garis Bujur)</label>
                    <input
                      type="number"
                      step="any"
                      value={formLongitude}
                      onChange={(e) => setFormLongitude(parseFloat(e.target.value))}
                      placeholder="114.602800"
                      className="w-full px-3.5 py-2 rounded-xl border border-coffee-200 text-xs font-mono bg-cream-50/50"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: FACILITIES CHECKBOXES */}
              <div className="space-y-3 bg-white p-5 rounded-2xl border border-coffee-200/80">
                <h4 className="font-serif font-bold text-sm text-coffee-950 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" /> 3. Fasilitas Toko Kopi
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {facilities.map((fac) => {
                    const isSelected = formFacilities.includes(fac.id);
                    return (
                      <button
                        key={fac.id}
                        type="button"
                        onClick={() => toggleFacility(fac.id)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-coffee-900 text-cream-50 border-coffee-900 shadow-sm'
                            : 'bg-cream-50 text-coffee-800 border-coffee-200 hover:bg-coffee-100/50'
                        }`}
                      >
                        {isSelected ? <CheckSquare className="w-4 h-4 text-amber-300" /> : <Square className="w-4 h-4 text-coffee-400" />}
                        <span>{fac.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 4: MENU MANAGEMENT (ADD/REMOVE MENU ITEMS) */}
              <div className="space-y-4 bg-white p-5 rounded-2xl border border-coffee-200/80">
                <div className="flex items-center justify-between border-b border-coffee-100 pb-3">
                  <h4 className="font-serif font-bold text-sm text-coffee-950 flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-coffee-800" /> 4. Daftar Menu Kopi & Makanan ({formMenuItems.length})
                  </h4>
                  <span className="text-[11px] text-coffee-600">Tambah menu favorit toko Anda</span>
                </div>

                {/* Form to Add New Menu Item */}
                <div className="bg-coffee-50 p-4 rounded-xl border border-coffee-200 space-y-3">
                  <span className="text-xs font-bold text-coffee-900 block">+ Tambah Item Menu Baru</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-1">
                      <label className="block text-[11px] font-bold text-coffee-700 mb-1">Nama Menu</label>
                      <input
                        type="text"
                        value={menuName}
                        onChange={(e) => setMenuName(e.target.value)}
                        placeholder="Contoh: Es Kopi Susu Aren"
                        className="w-full px-3 py-1.5 rounded-lg border border-coffee-200 text-xs bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-coffee-700 mb-1">Kategori</label>
                      <select
                        value={menuCategory}
                        onChange={(e) => setMenuCategory(e.target.value as any)}
                        className="w-full px-3 py-1.5 rounded-lg border border-coffee-200 text-xs bg-white"
                      >
                        <option value="Kopi">Kopi</option>
                        <option value="Non-Kopi">Non-Kopi</option>
                        <option value="Makanan">Makanan</option>
                        <option value="Dessert">Dessert</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-coffee-700 mb-1">Harga (Rp)</label>
                      <input
                        type="number"
                        value={menuPrice}
                        onChange={(e) => setMenuPrice(Number(e.target.value))}
                        placeholder="25000"
                        className="w-full px-3 py-1.5 rounded-lg border border-coffee-200 text-xs bg-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                      type="text"
                      value={menuDesc}
                      onChange={(e) => setMenuDesc(e.target.value)}
                      placeholder="Deskripsi singkat menu (opsional)..."
                      className="w-full px-3 py-1.5 rounded-lg border border-coffee-200 text-xs bg-white"
                    />

                    <label className="flex items-center gap-1.5 text-xs font-semibold text-coffee-800 shrink-0 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={menuRecommended}
                        onChange={(e) => setMenuRecommended(e.target.checked)}
                        className="rounded border-coffee-300 text-coffee-800 focus:ring-coffee-600"
                      />
                      <span>Menu Rekomendasi</span>
                    </label>

                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={handleAddMenuItem}
                      className="shrink-0 text-xs"
                    >
                      + Tambah Menu
                    </Button>
                  </div>
                </div>

                {/* Display Current Added Menu Items */}
                {formMenuItems.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {formMenuItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-cream-50 border border-coffee-200 text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-coffee-950">{item.name}</span>
                            <Badge variant="coffee" size="sm">{item.category}</Badge>
                            {item.is_recommended && (
                              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                ★ Rekomendasi
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-[11px] text-coffee-600 line-clamp-1">{item.description}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-coffee-900">
                            Rp {item.price.toLocaleString('id-ID')}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveMenuItem(item.id)}
                            className="p-1 rounded-lg text-red-600 hover:bg-red-100"
                            title="Hapus Menu"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-coffee-500 italic text-center py-2">Belum ada menu ditambahkan.</p>
                )}
              </div>

              {/* SECTION 5: IMAGE UPLOAD */}
              <div className="space-y-3 bg-white p-5 rounded-2xl border border-coffee-200/80">
                <h4 className="font-serif font-bold text-sm text-coffee-950 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-terracotta-500" /> 5. Foto Sampul Utama Toko Kopi
                </h4>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-xs text-coffee-700 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-coffee-900 file:text-cream-50 hover:file:bg-coffee-800 cursor-pointer"
                  />
                  {uploadingImage && <span className="text-xs text-coffee-600 animate-pulse">Mengunggah gambar...</span>}
                </div>
                {formImageUrl && (
                  <div className="mt-2 relative w-32 h-24 rounded-xl overflow-hidden border border-coffee-300 shadow-sm">
                    <Image src={formImageUrl} alt="Preview" fill className="object-cover" />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-coffee-200">
                <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>
                  Batal
                </Button>
                <Button variant="primary" size="md" type="submit" leftIcon={<CheckCircle className="w-4 h-4" />}>
                  Simpan Toko Kopi & Menu
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
