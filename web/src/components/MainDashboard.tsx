"use client";

import React from "react";
import { Navigation } from "@/components/Navigation";
import { useRouter } from "next/navigation";

type MainDashboardProps = {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: { name: string };
};

export function MainDashboard({ children, activeTab, onTabChange, user }: MainDashboardProps) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation
        activeTab={activeTab}
        onTabChange={onTabChange}
        user={user}
      />
      <main>{children}</main>
    </div>
  );
}
