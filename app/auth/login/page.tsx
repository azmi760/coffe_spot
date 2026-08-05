'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Coffee, Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Harap isi email dan kata sandi.');
      return;
    }

    setIsLoading(true);

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message || 'Gagal masuk. Periksa kembali email dan kata sandi.');
        setIsLoading(false);
        return;
      }
    }

    // Save active user info for smooth demo testing
    const demoUser = {
      id: 'usr-' + Date.now(),
      email,
      role: email.includes('admin') ? 'admin' : 'user',
      user_metadata: { full_name: email.split('@')[0] },
    };
    localStorage.setItem('cs_user', JSON.stringify(demoUser));

    setIsLoading(false);
    router.push('/');
    router.refresh();
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-cream-50 p-8 rounded-3xl border border-coffee-200 shadow-warm-hover space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-coffee-800 flex items-center justify-center text-cream-50">
              <Coffee className="w-5 h-5 text-terracotta-500" />
            </div>
            <span className="font-serif font-bold text-2xl text-coffee-950">
              Coffe<span className="text-terracotta-500">Spot</span>
            </span>
          </Link>
          <h1 className="font-serif text-2xl font-bold text-coffee-950 pt-2">Selamat Datang Kembali</h1>
          <p className="text-xs text-coffee-700">Masuk ke akun CoffeSpot kamu untuk mengelola favorit & ulasan.</p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 text-red-600 text-xs border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-coffee-800 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-coffee-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-coffee-200 bg-white text-xs text-coffee-950 focus:ring-2 focus:ring-coffee-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-coffee-800 mb-1">Kata Sandi</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-coffee-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-coffee-200 bg-white text-xs text-coffee-950 focus:ring-2 focus:ring-coffee-600"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full justify-center"
            leftIcon={<LogIn className="w-4 h-4" />}
          >
            Masuk Akun
          </Button>
        </form>

        <div className="pt-4 border-t border-coffee-200 text-center text-xs text-coffee-700">
          Belum punya akun CoffeSpot?{' '}
          <Link href="/auth/register" className="font-bold text-terracotta-600 hover:underline inline-flex items-center gap-1">
            Daftar Sekarang <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
