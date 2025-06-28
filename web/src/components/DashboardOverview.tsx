'use client'

import React from 'react';
import { Navigation } from '@/components/Navigation';
import { mockCustomers } from '@/lib/data';
import { Users, TrendingUp, DollarSign, Clock, BarChart3, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function DashboardOverview() {
  const router = useRouter();

  const getTotalCustomers = () => mockCustomers.length;
  const getAverageSpend = () => {
    const total = mockCustomers.reduce((sum, customer) => sum + customer.averageSpend, 0);
    return Math.round(total / mockCustomers.length);
  };
  const getTotalVisits = () => mockCustomers.reduce((sum, customer) => sum + customer.totalVisits, 0);
  const getVIPCustomers = () => mockCustomers.filter(customer => customer.visitFrequency === 'VIP').length;
  const getRecentCustomers = () => {
    return mockCustomers
      .sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime())
      .slice(0, 5);
  };

  const formatLastVisit = (date: string) => {
    const visitDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - visitDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '昨日';
    if (diffDays < 7) return `${diffDays}日前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}週間前`;
    return `${Math.floor(diffDays / 30)}ヶ月前`;
  };

  const onTabChange = (tab: string) => {
    router.push(`/${tab}`);
  };

  const searchTerm = '';
  const setSearchTerm = (term: string) => {
    // Implementation of setSearchTerm
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation
        onTabChange={onTabChange}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-white text-3xl font-bold mb-2">ダッシュボード</h1>
          <p className="text-gray-400">今日の営業状況と顧客情報の概要</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-amber-500/50 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">総顧客数</p>
                <p className="text-white text-2xl font-bold">{getTotalCustomers()}</p>
                <p className="text-green-400 text-xs mt-1">+2 今月</p>
              </div>
              <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-amber-500" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-green-500/50 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">平均消費額</p>
                <p className="text-white text-2xl font-bold">¥{getAverageSpend().toLocaleString()}</p>
                <p className="text-green-400 text-xs mt-1">+8% 先月比</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">総来店回数</p>
                <p className="text-white text-2xl font-bold">{getTotalVisits()}</p>
                <p className="text-blue-400 text-xs mt-1">全期間</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-amber-500/50 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">VIP顧客</p>
                <p className="text-white text-2xl font-bold">{getVIPCustomers()}</p>
                <p className="text-amber-400 text-xs mt-1">特別対応</p>
              </div>
              <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-amber-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Customers */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-lg flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                最近の来店顧客
              </h3>
              <button
                onClick={() => router.push('/customers')}
                className="text-amber-500 hover:text-amber-400 text-sm font-medium transition-colors"
              >
                すべて表示
              </button>
            </div>
            
            <div className="space-y-4">
              {getRecentCustomers().map((customer) => (
                <div 
                  key={customer.id}
                  className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/customers/${customer.id}`)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                      <span className="text-gray-900 font-semibold text-sm">
                        {customer.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="text-white font-medium">{customer.name}</div>
                      <div className="text-gray-400 text-sm">{customer.preferredDrinks[0]}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-400 text-sm">{formatLastVisit(customer.lastVisit)}</div>
                    <div className="text-amber-500 text-sm font-medium">¥{customer.averageSpend.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-white font-semibold text-lg mb-6 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              クイックアクション
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => router.push('/customers')}
                className="flex items-center justify-between p-4 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-all duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6 text-amber-500" />
                  <div className="text-left">
                    <div className="text-white font-medium">顧客管理</div>
                    <div className="text-gray-400 text-sm">顧客情報の確認・編集</div>
                  </div>
                </div>
                <div className="text-amber-500 group-hover:translate-x-1 transition-transform">→</div>
              </button>

              <button
                onClick={() => router.push('/analytics')}
                className="flex items-center justify-between p-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg transition-all duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                  <div className="text-left">
                    <div className="text-white font-medium">売上分析</div>
                    <div className="text-gray-400 text-sm">トレンドと統計情報</div>
                  </div>
                </div>
                <div className="text-blue-500 group-hover:translate-x-1 transition-transform">→</div>
              </button>

              <button
                onClick={() => router.push('/settings')}
                className="flex items-center justify-between p-4 bg-gray-500/10 hover:bg-gray-500/20 border border-gray-500/30 rounded-lg transition-all duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-6 h-6 text-gray-500" />
                  <div className="text-left">
                    <div className="text-white font-medium">システム設定</div>
                    <div className="text-gray-400 text-sm">アプリケーション設定</div>
                  </div>
                </div>
                <div className="text-gray-500 group-hover:translate-x-1 transition-transform">→</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}