import { SettingsPage } from "@/components/pages/SettingsPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "設定",
  description: "システム設定、ユーザー管理、アプリケーション設定を行えます。",
  keywords: ["設定", "システム設定", "ユーザー管理"],
  openGraph: {
    title: "設定 | Bar CMS",
    description: "システム設定、ユーザー管理、アプリケーション設定を行えます。",
  },
};

export default function Page() {
  return <SettingsPage />;
}
