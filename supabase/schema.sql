-- ========================================================
-- COFFESPOT SUPABASE DATABASE SCHEMA & INITIAL DATA SEED
-- REAL BANJARMASIN COFFEE SHOPS ON GOOGLE MAPS
-- ========================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- AUTOMATIC CLEANUP OF OLD TABLES & FUNCTIONS (IF EXISTS)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_review_changed ON public.reviews;

-- 1. Drop tables FIRST with CASCADE (drops attached policies)
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.favorites CASCADE;
DROP TABLE IF EXISTS public.place_images CASCADE;
DROP TABLE IF EXISTS public.place_facilities CASCADE;
DROP TABLE IF EXISTS public.place_moods CASCADE;
DROP TABLE IF EXISTS public.places CASCADE;
DROP TABLE IF EXISTS public.facilities CASCADE;
DROP TABLE IF EXISTS public.moods CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. Drop functions with CASCADE
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_place_rating_stats() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;

-- ========================================================
-- CREATE TABLES
-- ========================================================

-- 1. PROFILES TABLE
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORIES TABLE
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MOODS TABLE
CREATE TABLE public.moods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. FACILITIES TABLE
CREATE TABLE public.facilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    icon TEXT
);

-- 5. PLACES TABLE
CREATE TABLE public.places (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    price_level INTEGER DEFAULT 2 CHECK (price_level BETWEEN 1 AND 4),
    average_rating DECIMAL(3, 2) DEFAULT 0.00,
    review_count INTEGER DEFAULT 0,
    opening_hours JSONB DEFAULT '[]'::jsonb,
    image_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PLACE_MOODS TABLE
CREATE TABLE public.place_moods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    place_id UUID REFERENCES public.places(id) ON DELETE CASCADE,
    mood_id UUID REFERENCES public.moods(id) ON DELETE CASCADE,
    score INTEGER DEFAULT 80 CHECK (score BETWEEN 1 AND 100),
    UNIQUE(place_id, mood_id)
);

-- 7. PLACE_FACILITIES TABLE
CREATE TABLE public.place_facilities (
    place_id UUID REFERENCES public.places(id) ON DELETE CASCADE,
    facility_id UUID REFERENCES public.facilities(id) ON DELETE CASCADE,
    PRIMARY KEY(place_id, facility_id)
);

-- 8. PLACE_IMAGES TABLE
CREATE TABLE public.place_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    place_id UUID REFERENCES public.places(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    display_order INTEGER DEFAULT 0
);

-- 9. FAVORITES TABLE
CREATE TABLE public.favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    place_id UUID REFERENCES public.places(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, place_id)
);

-- 10. REVIEWS TABLE
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    place_id UUID REFERENCES public.places(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, place_id)
);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.place_moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.place_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.place_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Helper Function: Check if User is Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Public Read Policies
CREATE POLICY "Categories viewable by all" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Moods viewable by all" ON public.moods FOR SELECT USING (true);
CREATE POLICY "Facilities viewable by all" ON public.facilities FOR SELECT USING (true);
CREATE POLICY "Active places viewable by all" ON public.places FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Place moods viewable by all" ON public.place_moods FOR SELECT USING (true);
CREATE POLICY "Place facilities viewable by all" ON public.place_facilities FOR SELECT USING (true);
CREATE POLICY "Place images viewable by all" ON public.place_images FOR SELECT USING (true);
CREATE POLICY "Reviews viewable by all" ON public.reviews FOR SELECT USING (true);

-- Favorites Policies (User scoped)
CREATE POLICY "Users can view own favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own favorites" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- Reviews Policies (User scoped)
CREATE POLICY "Users can create own review" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own review" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own review" ON public.reviews FOR DELETE USING (auth.uid() = user_id OR is_admin());

-- Admin Management Policies
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL USING (is_admin());
CREATE POLICY "Admins manage moods" ON public.moods FOR ALL USING (is_admin());
CREATE POLICY "Admins manage facilities" ON public.facilities FOR ALL USING (is_admin());
CREATE POLICY "Admins manage places" ON public.places FOR ALL USING (is_admin());
CREATE POLICY "Admins manage place_moods" ON public.place_moods FOR ALL USING (is_admin());
CREATE POLICY "Admins manage place_facilities" ON public.place_facilities FOR ALL USING (is_admin());
CREATE POLICY "Admins manage place_images" ON public.place_images FOR ALL USING (is_admin());

-- ========================================================
-- AUTOMATIC TRIGGERS & FUNCTIONS
-- ========================================================

-- Trigger to create profile when auth.users is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to recalculate place average rating and review count
CREATE OR REPLACE FUNCTION public.update_place_rating_stats()
RETURNS TRIGGER AS $$
DECLARE
    target_place_id UUID;
BEGIN
    IF (TG_OP = 'DELETE') THEN
        target_place_id := OLD.place_id;
    ELSE
        target_place_id := NEW.place_id;
    END IF;

    UPDATE public.places
    SET 
        average_rating = COALESCE((SELECT ROUND(AVG(rating)::numeric, 2) FROM public.reviews WHERE place_id = target_place_id), 0.00),
        review_count = (SELECT COUNT(*) FROM public.reviews WHERE place_id = target_place_id)
    WHERE id = target_place_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_review_changed ON public.reviews;
CREATE TRIGGER on_review_changed
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_place_rating_stats();

-- ========================================================
-- DEMO SEED DATA (10 REAL BANJARMASIN CAFE SPOTS)
-- ========================================================

-- Seed Categories
INSERT INTO public.categories (id, name, slug, icon) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Coffee Shop Artisan', 'coffee-shop-artisan', 'Coffee'),
  ('c1000000-0000-0000-0000-000000000002', 'Kafe Minimalis', 'kafe-minimalis', 'CupSoda'),
  ('c1000000-0000-0000-0000-000000000003', 'Resto Santai', 'resto-santai', 'Utensils'),
  ('c1000000-0000-0000-0000-000000000004', 'Work Coffee Space', 'work-coffee-space', 'Laptop'),
  ('c1000000-0000-0000-0000-000000000005', 'Garden Cafe & Outdoor', 'garden-cafe-outdoor', 'Trees')
ON CONFLICT (slug) DO NOTHING;

-- Seed Moods
INSERT INTO public.moods (id, name, slug, description, icon) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'Santai', 'santai', 'Suasana rileks untuk bersantai sejenak', 'Smile'),
  ('b1000000-0000-0000-0000-000000000002', 'Fokus & Produktif', 'fokus', 'Tenang dengan fasilitas lengkap untuk bekerja', 'Target'),
  ('b1000000-0000-0000-0000-000000000003', 'Nugas / Bekerja', 'nugas', 'Banyak colokan listrik dan Wi-Fi super kencang', 'BookOpen'),
  ('b1000000-0000-0000-0000-000000000004', 'Ngobrol Teman', 'ngobrol', 'Tempat seru dan lega untuk nongkrong rame-rame', 'Users'),
  ('b1000000-0000-0000-0000-000000000005', 'Romantis', 'romantis', 'Pencahayaan hangat dan spot intimate berdua', 'Heart'),
  ('b1000000-0000-0000-0000-000000000006', 'Ramai & Meriah', 'ramai', 'Suasana ramai, hits, dan penuh energi', 'Sparkles'),
  ('b1000000-0000-0000-0000-000000000007', 'Tenang & Hening', 'tenang', 'Jauh dari kebisingan jalanan, pas untuk healing', 'VolumeX'),
  ('b1000000-0000-0000-0000-000000000008', 'Live Music', 'live-music', 'Nikmati penampilan musik langsung setiap malam', 'Music'),
  ('b1000000-0000-0000-0000-000000000009', 'Foto / Estetik', 'estetik', 'Interior instagramable & arsitektur keren', 'Camera'),
  ('b1000000-0000-0000-0000-000000000010', 'Nongkrong Malam', 'nongkrong-malam', 'Buka 24 jam atau hingga larut malam', 'Moon')
ON CONFLICT (slug) DO NOTHING;

-- Seed Facilities
INSERT INTO public.facilities (id, name, icon) VALUES
  ('f1000000-0000-0000-0000-000000000001', 'Wi-Fi Kencang', 'Wifi'),
  ('f1000000-0000-0000-0000-000000000002', 'Banyak Colokan', 'Zap'),
  ('f1000000-0000-0000-0000-000000000003', 'Area Outdoor', 'Wind'),
  ('f1000000-0000-0000-0000-000000000004', 'AC Dingin', 'Airplay'),
  ('f1000000-0000-0000-0000-000000000005', 'Area Merokok (Smoking)', 'Flame'),
  ('f1000000-0000-0000-0000-000000000006', 'Parkir Luas', 'Car'),
  ('f1000000-0000-0000-0000-000000000007', 'Musholla', 'Compass'),
  ('f1000000-0000-0000-0000-000000000008', 'Pet Friendly', 'Dog'),
  ('f1000000-0000-0000-0000-000000000009', 'Meja Kerja Ergonomis', 'Armchair')
ON CONFLICT DO NOTHING;

-- Seed Places (10 Real Banjarmasin Cafes on Google Maps)
INSERT INTO public.places (id, name, slug, description, address, city, latitude, longitude, category_id, price_level, average_rating, review_count, opening_hours, image_url, is_active) VALUES
(
  'd1000000-0000-0000-0000-000000000001',
  'Kopitagram Banjarmasin',
  'kopitagram-banjarmasin-kayutangi',
  'Coffee shop hits berkonsep arsitektur industrial modern kaca di kawasan Kayutangi Banjarmasin Utara. Terkenal dengan minuman Banter (Es Kopi Susu), tempat outdoor yang estetik, dan area nugas nyaman.',
  'Jl. H. Hasan Basri No. 7, Kayutangi',
  'Banjarmasin Utara',
  -3.29828500,
  114.58826500,
  'c1000000-0000-0000-0000-000000000001',
  2,
  4.90,
  86,
  '[{"day":"Senin - Minggu","open":"08:00","close":"23:00"}]'::jsonb,
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
  true
),
(
  'd1000000-0000-0000-0000-000000000002',
  'Ruang Bersua Coffee & Space',
  'ruang-bersua-coffee-space-sultan-adam-banjarmasin',
  'Spot kopi favorit di jalan Sultan Adam Banjarmasin. Memiliki area indoor dingin sejuk serta garden outdoor rimbun. Sangat kondusif untuk bekerja (WFC), mengerjakan tugas skripsi, maupun ngobrol santai.',
  'Jl. Sultan Adam No. 28, Surgi Mufti',
  'Banjarmasin Utara',
  -3.30452100,
  114.60081200,
  'c1000000-0000-0000-0000-000000000004',
  2,
  4.88,
  74,
  '[{"day":"Senin - Minggu","open":"09:00","close":"23:30"}]'::jsonb,
  'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1200&q=80',
  true
),
(
  'd1000000-0000-0000-0000-000000000003',
  'Subur Coffee Banjarmasin',
  'subur-coffee-veteran-banjarmasin',
  'Artisan coffee shop hangat di kawasan Veteran Banjarmasin Timur. Menyajikan specialty single origin espresso, cold brew segar, dan aneka croissant hangat dalam suasana yang tenang dan estetik.',
  'Jl. Veteran No. 8, Melayu',
  'Banjarmasin Timur',
  -3.32481000,
  114.60742000,
  'c1000000-0000-0000-0000-000000000001',
  2,
  4.85,
  62,
  '[{"day":"Senin - Minggu","open":"08:00","close":"22:00"}]'::jsonb,
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
  true
),
(
  'd1000000-0000-0000-0000-000000000004',
  'Kopi Janji Jiwa - Siring Tendean',
  'kopi-janji-jiwa-siring-tendean-banjarmasin',
  'Berlokasi tepat di tepi Sungai Martapura kawasan Menara Pandang Siring Pierre Tendean Banjarmasin Tengah. Tempat terbaik menikmati Es Kopi Pokat & Toast hangat sambil menikmati hembusan angin sungai.',
  'Jl. Kapten Pierre Tendean No. 25, Gadang',
  'Banjarmasin Tengah',
  -3.32115000,
  114.59385000,
  'c1000000-0000-0000-0000-000000000002',
  1,
  4.82,
  95,
  '[{"day":"Senin - Minggu","open":"08:00","close":"23:00"}]'::jsonb,
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
  true
),
(
  'd1000000-0000-0000-0000-000000000005',
  'Kopi Dari Hati - A. Yani Km 4.5',
  'kopi-dari-hati-ayani-banjarmasin',
  'Kafe modern di jalan utama Protokol A. Yani Km 4.5 Banjarmasin Timur. Dilengkapi tempat duduk sofa empuk, colokan melimpah, Wi-Fi kencang, serta area parkir yang sangat luas.',
  'Jl. A. Yani Km 4.5, Karang Mekar',
  'Banjarmasin Timur',
  -3.33712000,
  114.60451000,
  'c1000000-0000-0000-0000-000000000003',
  2,
  4.80,
  58,
  '[{"day":"Senin - Minggu","open":"09:00","close":"23:00"}]'::jsonb,
  'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1200&q=80',
  true
),
(
  'd1000000-0000-0000-0000-000000000006',
  'Kopi Chuseyo Banjarmasin',
  'kopi-chuseyo-ks-tubun-banjarmasin',
  'Kafe K-Pop & Korea pertama di Banjarmasin Selatan. Tempat favorit anak muda dan pecinta Korea untuk kumpul komunitas, ngobrol seru, foto-foto estetik, dan mendengarkan musik Hits.',
  'Jl. K. S. Tubun No. 42, Kelayan Barat',
  'Banjarmasin Selatan',
  -3.33289000,
  114.58912000,
  'c1000000-0000-0000-0000-000000000002',
  1,
  4.87,
  104,
  '[{"day":"Senin - Minggu","open":"10:00","close":"22:00"}]'::jsonb,
  'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1200&q=80',
  true
),
(
  'd1000000-0000-0000-0000-000000000007',
  'Bawa Kopi Banjarmasin',
  'bawa-kopi-belitung-darat-banjarmasin',
  'Coffee shop lokal favorit warga Belitung Darat Banjarmasin Barat. Terkenal dengan racikan Es Kopi Susu Aren ramah kantong, tempat duduk outdoor santai, dan barista yang sangat ramah.',
  'Jl. Belitung Darat No. 102, Kuin Selatan',
  'Banjarmasin Barat',
  -3.31182000,
  114.57891000,
  'c1000000-0000-0000-0000-000000000001',
  1,
  4.84,
  67,
  '[{"day":"Senin - Minggu","open":"08:30","close":"23:00"}]'::jsonb,
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80',
  true
),
(
  'd1000000-0000-0000-0000-000000000008',
  'Kopi Soe - Lambung Mangkurat',
  'kopi-soe-lambung-mangkurat-banjarmasin',
  'Kafe modern serba praktis di kawasan perbankan Lambung Mangkurat Banjarmasin Tengah. Tempat transit favorit pekerja kantor untuk menikmati Es Rum Regal dan Kopi Soe Goela Merah.',
  'Jl. Lambung Mangkurat No. 15, Kertak Baru',
  'Banjarmasin Tengah',
  -3.31885000,
  114.59075000,
  'c1000000-0000-0000-0000-000000000002',
  1,
  4.81,
  51,
  '[{"day":"Senin - Minggu","open":"08:00","close":"22:00"}]'::jsonb,
  'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1200&q=80',
  true
),
(
  'd1000000-0000-0000-0000-000000000009',
  'Kopi Lain Hati Kayutangi',
  'kopi-lain-hati-kayutangi-banjarmasin',
  'Spot nongkrong rame-rame favorit mahasiswa Universitas Lambung Mangkurat (ULM) di Kayutangi. Buka hingga larut malam dengan pilihan Es Kopi Main Hati dan camilan kentang goreng renyah.',
  'Jl. H. Hasan Basri No. 88, Kayutangi',
  'Banjarmasin Utara',
  -3.29651000,
  114.58721000,
  'c1000000-0000-0000-0000-000000000004',
  1,
  4.83,
  89,
  '[{"day":"Senin - Minggu","open":"09:00","close":"24:00"}]'::jsonb,
  'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=1200&q=80',
  true
),
(
  'd1000000-0000-0000-0000-000000000010',
  'Kopi Kenangan - Duta Mall Banjarmasin',
  'kopi-kenangan-duta-mall-banjarmasin',
  'Berada di Lantai 1 Duta Mall Banjarmasin (mall terbesar di Kalsel). Pilihan terbaik untuk menikmati Kopi Kenangan Mantan hangat sebelum nonton bioskop atau setelah berbelanja.',
  'Duta Mall Banjarmasin Lt. 1, Jl. A. Yani Km 2',
  'Banjarmasin Tengah',
  -3.32671000,
  114.59821000,
  'c1000000-0000-0000-0000-000000000001',
  2,
  4.86,
  112,
  '[{"day":"Senin - Minggu","open":"10:00","close":"22:00"}]'::jsonb,
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
  true
)
ON CONFLICT (slug) DO NOTHING;

-- Link Places to Moods
INSERT INTO public.place_moods (place_id, mood_id, score) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000009', 99),
  ('d1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000003', 95),
  ('d1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000002', 98),
  ('d1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000003', 96),
  ('d1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000001', 96),
  ('d1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000007', 93),
  ('d1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000001', 97),
  ('d1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000004', 94),
  ('d1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000004', 95),
  ('d1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000002', 92),
  ('d1000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000009', 98),
  ('d1000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000006', 96),
  ('d1000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000001', 96),
  ('d1000000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000001', 94),
  ('d1000000-0000-0000-0000-000000000009', 'b1000000-0000-0000-0000-000000000010', 98),
  ('d1000000-0000-0000-0000-000000000010', 'b1000000-0000-0000-0000-000000000001', 94)
ON CONFLICT DO NOTHING;

-- Link Places to Facilities
INSERT INTO public.place_facilities (place_id, facility_id) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000001'),
  ('d1000000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000002'),
  ('d1000000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000003'),
  ('d1000000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000004'),
  ('d1000000-0000-0000-0000-000000000002', 'f1000000-0000-0000-0000-000000000001'),
  ('d1000000-0000-0000-0000-000000000002', 'f1000000-0000-0000-0000-000000000002'),
  ('d1000000-0000-0000-0000-000000000002', 'f1000000-0000-0000-0000-000000000007'),
  ('d1000000-0000-0000-0000-000000000002', 'f1000000-0000-0000-0000-000000000009'),
  ('d1000000-0000-0000-0000-000000000003', 'f1000000-0000-0000-0000-000000000001'),
  ('d1000000-0000-0000-0000-000000000003', 'f1000000-0000-0000-0000-000000000004'),
  ('d1000000-0000-0000-0000-000000000004', 'f1000000-0000-0000-0000-000000000003'),
  ('d1000000-0000-0000-0000-000000000004', 'f1000000-0000-0000-0000-000000000005')
ON CONFLICT DO NOTHING;
