"use client";

import React from "react";
import { CustomerDetail } from "@/components/CustomerDetail";
import { mockCustomers } from "@/lib/data";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface CustomerDetailPageProps {
  customerId: string;
}

export function CustomerDetailPage({ customerId }: CustomerDetailPageProps) {
  const router = useRouter();
  const customer = mockCustomers.find((c) => c.id === customerId);

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <ArrowLeft className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-white text-2xl font-bold mb-2">
            顧客が見つかりません
          </h1>
          <p className="text-gray-400 mb-6">指定された顧客IDは存在しません</p>
          <button
            onClick={() => router.push("/customers")}
            className="bg-amber-500 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-amber-400 transition-colors"
          >
            顧客一覧に戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <CustomerDetail
      customer={customer}
      onBack={() => router.push("/customers")}
    />
  );
}
