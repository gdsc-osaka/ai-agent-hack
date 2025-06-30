import { CustomerDetailPage } from "@/components/pages/CustomerDetailPage";
import { mockCustomers } from "@/lib/data";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

// PageのPropsの型定義
type PageProps = {
  params: { id: string };
};

export function generateStaticParams() {
  return mockCustomers.map((customer) => ({
    id: customer.id,
  }));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const customer = mockCustomers.find((c) => c.id === params.id);

  if (!customer) {
    return {
      title: "顧客が見つかりません",
      description: "指定された顧客情報が見つかりませんでした。",
    };
  }

  return {
    title: `${customer.name}の詳細情報`,
    description: `${customer.name}様の詳細情報 - 来店回数: ${customer.totalVisits}回、平均消費額: ¥${customer.averageSpend.toLocaleString()}、好みの飲み物: ${customer.preferredDrinks.join("、")}`,
    keywords: ["顧客詳細", customer.name, ...customer.preferredDrinks],
    openGraph: {
      title: `${customer.name}の詳細情報 | Bar CMS`,
      description: `${customer.name}様の詳細情報と来店履歴をご確認いただけます。`,
    },
  };
}

// Pageコンポーネントの型定義を修正
export default function Page({ params }: { params: { id: string } }) {
  const customer = mockCustomers.find((c) => c.id === params.id);

  if (!customer) {
    notFound();
  }

  return <CustomerDetailPage customerId={params.id} />;
}
