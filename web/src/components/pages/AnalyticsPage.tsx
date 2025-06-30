"use client";

import React from "react";
import { Navigation } from "@/components/Navigation";
import { useRouter } from "next/navigation";

export function AnalyticsPage() {
  const router = useRouter();

  const onTabChange = (tab: string) => {
    router.push(tab === "analytics" ? "/analytics" : `/${tab}`);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation onTabChange={onTabChange} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-white text-3xl font-bold mb-8">分析</h1>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-white text-xl font-semibold mb-4">データ分析</h2>
          <p className="text-gray-400">分析画面の実装は開発中です。</p>
        </div>
      </div>
    </div>
  );
}
