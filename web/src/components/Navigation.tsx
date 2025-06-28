'use client'

import React from 'react';
import { Users, BarChart3, Settings as SettingsIcon, Search } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

interface NavigationProps {
  onTabChange: (tab: string) => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  onTabChange, 
  searchTerm = '', 
  onSearchChange 
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const tabs: Tab[] = [
    { id: 'customers', label: '顧客管理', icon: Users, path: '/customers' },
    { id: 'analytics', label: '分析', icon: BarChart3, path: '/analytics' },
    { id: 'settings', label: '設定', icon: SettingsIcon, path: '/settings' }
  ];

  const handleTabClick = (tab: Tab) => {
    router.push(tab.path);
    onTabChange(tab.id);
  };

  const isActive = (tabPath: string) => {
    if (tabPath === '/customers') {
      return pathname === '/customers' || pathname.startsWith('/customers/');
    }
    return pathname === tabPath;
  };

  return (
    <div className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => router.push('/')}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-gray-900" />
              </div>
              <div>
                <span className="text-white font-bold text-xl">Bar CMS</span>
                <div className="text-amber-500 text-xs font-medium">Customer Management</div>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(tab.path)
                        ? 'bg-amber-500 text-gray-900 shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {pathname.startsWith('/customers') && onSearchChange && (
              <div className="hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="顧客を検索..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 w-64"
                  />
                </div>
              </div>
            )}
            
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
        
        {/* Mobile navigation */}
        <div className="md:hidden pb-4">
          <div className="flex space-x-2 mb-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(tab.path)
                      ? 'bg-amber-500 text-gray-900'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
          
          {pathname.startsWith('/customers') && onSearchChange && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="顧客を検索..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};