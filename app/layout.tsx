import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'CoffeSpot - Cari Tempat Nongkrong Sesuai Mood Kamu',
  description: 'Platform rekomendasi coffee shop, kafe minimalis, dan tempat nongkrong santai terbaik di Indonesia sesuai suasana hati dan aktivitas kamu.',
  keywords: ['coffee shop', 'tempat nongkrong', 'kafe jakarta', 'kafe bandung', 'wfc cafe', 'nugas spot'],
  openGraph: {
    title: 'CoffeSpot - Rekomendasi Spot Nongkrong & Kopi',
    description: 'Temukan coffee shop dan tempat nongkrong yang cocok dengan suasana hati, aktivitas, dan gaya kamu.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="bg-coffee-50 text-coffee-950 flex flex-col min-h-screen antialiased selection:bg-coffee-800 selection:text-cream-50">
        <Navbar />
        <main className="flex-1 pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
