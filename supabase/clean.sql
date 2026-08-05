-- ========================================================
-- COFFESPOT SUPABASE CLEAN & RESET DATABASE SCRIPT
-- Jalankan query ini di Supabase SQL Editor untuk membersihkan
-- semua tabel lama sebelum menjalankan file schema.sql yang baru.
-- ========================================================

-- 1. Hapus Triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_review_changed ON public.reviews;

-- 2. Hapus Semua Tabel Lama secara Berurutan (CASCADE - Otomatis menghapus policy yang terikat)
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

-- 3. Hapus Helper Functions dengan CASCADE
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_place_rating_stats() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
