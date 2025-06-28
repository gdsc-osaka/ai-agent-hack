'use client'

import React, { useState, useMemo } from 'react';
import { Navigation } from '@/components/Navigation';
import { CustomerCard } from '@/components/CustomerCard';
import { mockCustomers } from '@/lib/data';
import { Customer } from '@/lib/types';
import { Users, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { performanceMetrics } from '@/lib/performance';

export function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  // Memoize filtered customers for performance
  const filteredCustomers = useMemo(() => {
    return mockCustomers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.preferredDrinks.some(drink => 
        drink.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  // Debounced search handler
  const debouncedSearch = useMemo(
    () => performanceMetrics.debounce(setSearchTerm, 300),
    []
  );

  const handleCustomerSelect = (customer: Customer) => {
    performanceMetrics.measureInteraction('customer-select', () => {
      // Preload the customer detail route
      performanceMetrics.preloadRoute(`/customers/${customer.id}`);
      router.push(`/customers/${customer.id}`);
    });
  };

  const onTabChange = (tab: string) => {
    router.push(tab === 'customers' ? '/customers' : `/${tab}`);
  };

  // Memoize statistics calculations
  const statistics = useMemo(() => ({
    totalCustomers: mockCustomers.length,
    averageSpend: Math.round(mockCustomers.reduce((sum, customer) => sum + customer.averageSpend, 0) / mockCustomers.length),
    totalVisits: mockCustomers.reduce((sum, customer) => sum + customer.totalVisits, 0),
    vipCustomers: mockCustomers.filter(customer => customer.visitFrequency === 'VIP').length
  }), []);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation
        onTabChange={onTabChange}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-amber-500/50 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">総顧客数</p>
                <p className="text-white text-2xl font-bold">{statistics.totalCustomers}</p>
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
                <p className="text-white text-2xl font-bold">¥{statistics.averageSpend.toLocaleString()}</p>
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
                <p className="text-white text-2xl font-bold">{statistics.totalVisits}</p>
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
                <p className="text-white text-2xl font-bold">{statistics.vipCustomers}</p>
              </div>
              <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-amber-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Customer Grid */}
        <div className="mb-6">
          <h2 className="text-white text-xl font-semibold mb-4">
            顧客一覧 ({filteredCustomers.length}人)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map((customer) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                onClick={() => handleCustomerSelect(customer)}
              />
            ))}
          </div>
          
          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-400 text-lg">検索条件に一致する顧客が見つかりません</p>
              <p className="text-gray-500 text-sm mt-2">検索キーワードを変更してみてください</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}