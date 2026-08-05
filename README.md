# CoffeSpot - Platform Rekomendasi Tempat Nongkrong & Coffee Shop

**CoffeSpot** adalah platform rekomendasi tempat nongkrong full-stack modern yang membantu pengguna menemukan coffee shop, kafe minimalis, resto santai, dan tempat hangout terbaik di Indonesia sesuai dengan mood (suasana hati), aktivitas, dan preferensi gaya hidup.

---

## 🚀 Teknologi yang Digunakan

- **Next.js 14 (App Router)** - Framework React modern dengan Server & Client Components
- **TypeScript** - Type safety penuh di seluruh aplikasi
- **Tailwind CSS** - Desain UI coffee shop custom dengan palet espresso, cream & terracotta
- **Supabase** - PostgreSQL Database, Auth (Email & Password), dan Storage (`place-images` bucket)
- **Lucide React** - Ikonografi modern
- **Vercel-Ready** - Siap di-deploy secara instant ke Vercel

---

## 📌 Fitur Utama

1. **Beranda Interaktif**: Hero banner, kartu selector mood, tempat populer, rating tertinggi, tempat terbaru, dan footer lengkap.
2. **Jelajahi & Multi-Filter**: Pencarian nama/lokasi, filter kategori, filter suasana (mood), filter harga ($ - $$$$), filter rating (4.0+, 4.5+), filter fasilitas (Wi-Fi, colokan, outdoor, pet friendly), filter buka sekarang, dan pagination.
3. **Rekomendasi Berbasis Mood**: Interactive 3-Step Wizard dengan algoritma pencocokan skor (Indikator *"95% Cocok dengan mood kamu"*).
4. **Detail Tempat Lengkap**: Galeri foto interaktif, jam operasional, badge fasilitas, peta visual & tautan Google Maps, ulasan pengguna & form pengiriman ulasan, serta rekomendasi tempat serupa.
5. **Favorit (Saved Places)**: Simpan tempat favorit bagi pengguna yang sudah login (dengan proteksi auth & sync).
6. **Autentikasi Supabase Auth**: Registrasi & Login email/password, persistent session management.
7. **Dashboard Admin (`/admin`)**: Statistik (total tempat, user, ulasan), CRUD Tempat Nongkrong, Upload foto ke Supabase Storage, kelola kategori/mood tags, dan moderasi ulasan.

---

## 🛠️ Panduan Setup & Instalasi Lokal

### 1. Meng-clone atau Membuka Proyek
```bash
cd c:\laragon\www\coffe_spot
```

### 2. Install Dependency
```bash
npm install
```

### 3. Setup Project Supabase & Database SQL
1. Buka [Supabase Dashboard](https://supabase.com) dan buat proyek baru.
2. Buka tab **SQL Editor** pada dashboard Supabase.
3. Buka file `supabase/schema.sql` pada proyek ini, salin seluruh isi SQL, lalu jalankan di SQL Editor Supabase.
   - Script SQL akan otomatis membuat tabel `profiles`, `places`, `categories`, `moods`, `facilities`, `place_moods`, `place_facilities`, `place_images`, `favorites`, dan `reviews`.
   - Menyiapkan Row Level Security (RLS) dan trigger otomatis rating & profil.
   - Mengisi data awal (Seed Data) 10 spot rekomendasi realistis di Jakarta, Bandung, Jogja, Surabaya, dan Bali.

### 4. Setup Storage Bucket Supabase
1. Buka tab **Storage** di Supabase.
2. Buat bucket baru bernama: `place-images` (centang opsi *Public bucket*).
3. (Optional) Policy storage sudah dikonfigurasi dalam `supabase/schema.sql`.

### 5. Konfigurasi Environment Variables
Buat file `.env.local` pada root direktori:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

*(Lihat contoh di `.env.example`)*

### 6. Menjalankan Aplikasi Secara Lokal
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

---

## 📦 Pengecekan Build Production

Untuk memastikan proyek dapat dibangun tanpa error sebelum deployment:

```bash
npm run build
```

---

## 🌐 Panduan Deployment ke Vercel

1. Push repository proyek ke akun GitHub / GitLab / Bitbucket Anda.
2. Buka [Vercel Dashboard](https://vercel.com) dan klik **Add New Project**.
3. Import repository **coffe-spot**.
4. Di bagian **Environment Variables**, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL` = (URL Supabase Anda)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (Anon Key Supabase Anda)
5. Klik **Deploy**. Vercel akan otomatis melakukan `npm run build` dan mempublikasikan aplikasi Anda secara live!

---

## 📝 Catatan Tambahan

- **Data Demo**: Data 10 tempat nongkrong yang disertakan adalah data demo awal untuk tujuan pengujian dan dapat dikelola secara penuh melalui Dashboard Admin (`/admin`).
- **Keamanan Kredensial**: Tidak ada API Key atau secret value yang ditulis langsung di source code. Semua kredensial dipanggil melalui `process.env`.
