"use client";

import React from "react";
import { Navigation } from "@/components/Navigation";
import { LucideIcon } from "lucide-react";

type Stat = {
  name: string;
  value: string;
  change: string;
  icon: LucideIcon;
};

type DashboardOverviewProps = {
  stats: Stat[];
  activeTab: string;
  user: { name: string };
  onTabChange: (tab: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
};

export function DashboardOverview({
  stats,
  activeTab,
  user,
  onTabChange,
  searchTerm,
  onSearchChange,
}: DashboardOverviewProps) {
  return (
    <div className="bg-gray-800 p-4 md:p-6 rounded-lg border border-gray-700">
       <Navigation
        activeTab={activeTab}
        user={user}
        onTabChange={onTabChange}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-900/50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">{stat.name}</p>
                <p className="text-white text-2xl font-bold">{stat.value}</p>
              </div>
              <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-amber-500" />
              </div>
            </div>
            <p className="text-green-400 text-xs mt-1">{stat.change}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
