'use client'

import React from 'react';
import { Navigation } from '@/components/Navigation';
import { useRouter } from 'next/navigation';

export function SettingsPage() {
  const router = useRouter();

  const onTabChange = (tab: string) => {
    router.push(tab === 'settings' ? '/settings' : `/${tab}`);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation onTabChange={onTabChange} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-white text-3xl font-bold mb-8">設定</h1>
        
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-white text-xl font-semibold mb-4">アプリケーション設定</h2>
          <p className="text-gray-400">設定画面の実装は開発中です。</p>
        </div>
      </div>
    </div>
  );
}