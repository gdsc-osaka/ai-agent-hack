"use client";

import React, { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { CustomersPage } from "@/components/pages/CustomersPage";
import { AnalyticsPage } from "@/components/pages/AnalyticsPage";
import { SettingsPage } from "@/components/pages/SettingsPage";
import { useRouter } from "next/navigation";

export function MainDashboard() {
  const router = useRouter();

  const onTabChange = (tab: string) => {
    router.push(`/${tab}`);
  };

  // 現在のパスに基づいてコンポーネントを表示
  const renderContent = () => {
    const pathname = window.location.pathname;

    if (pathname.startsWith("/customers")) {
      return <CustomersPage />;
    } else if (pathname.startsWith("/analytics")) {
      return <AnalyticsPage />;
    } else if (pathname.startsWith("/settings")) {
      return <SettingsPage />;
    } else {
      // デフォルトはcustomersページ
      return <CustomersPage />;
    }
  };

  return <div className="min-h-screen bg-gray-900">{renderContent()}</div>;
}
