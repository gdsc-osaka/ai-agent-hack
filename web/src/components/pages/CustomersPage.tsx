"use client";
import React, { useState, useMemo } from 'react';
import { Navigation } from "@/components/Navigation";
import { CustomerCard } from "@/components/CustomerCard";
import { Input } from "../ui/input";
import { mockCustomers } from "@/lib/data";
import type { Customer } from "@/lib/types";
import { Users, TrendingUp, DollarSign, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { debounce } from 'lodash-es';
import { MainDashboard } from "@/components/MainDashboard";
import { DashboardOverview } from "@/components/DashboardOverview";

export function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // Debounced search handler
  const debouncedSetSearchTerm = useMemo(
    () => debounce((value: string) => setSearchTerm(value), 300),
    []
  );

  // Memoize filtered customers for performance
  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return mockCustomers;
    return mockCustomers.filter((customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleCustomerSelect = (customer: Customer) => {
    router.push(`/dashboard/customers/${customer.id}`);
  };

  const onTabChange = (value: string) => {
    router.push(`/dashboard?tab=${value}`);
  };

  const handleSearchChange = (term: string) => {
    debouncedSetSearchTerm(term);
  };

  return (
    <MainDashboard
      activeTab="customers"
      onTabChange={onTabChange}
      user={{ name: "Kaito" }}
    >
      <DashboardOverview
        stats={[
          {
            name: "総顧客数",
            value: "1,204",
            change: "+2.5%",
            icon: Users,
          },
          {
            name: "新規顧客",
            value: "82",
            change: "+12%",
            icon: TrendingUp,
          },
          {
            name: "平均単価",
            value: "¥8,540",
            change: "-0.8%",
            icon: DollarSign,
          },
          { name: "平均滞在時間", value: "1.5h", change: "+3%", icon: Clock },
        ]}
        activeTab="customers"
        user={{ name: "Kaito" }}
        onTabChange={onTabChange}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 md:p-6">
        {filteredCustomers.map((customer: Customer) => (
          <CustomerCard
            key={customer.id}
            customer={customer}
            onClick={() => handleCustomerSelect(customer)}
          />
        ))}
      </div>
    </MainDashboard>
  );
}
