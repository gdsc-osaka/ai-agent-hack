import React from "react";
import { Customer } from "@/lib/types";
import { Calendar, TrendingUp, Award, Clock } from "lucide-react";

interface CustomerCardProps {
  customer: Customer;
  onClick: () => void;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({
  customer,
  onClick,
}) => {
  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case "VIP":
        return "bg-amber-500 text-gray-900";
      case "Regular":
        return "bg-green-500 text-white";
      case "Occasional":
        return "bg-blue-500 text-white";
      case "New":
        return "bg-purple-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const formatLastVisit = (date: string) => {
    const visitDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - visitDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "昨日";
    if (diffDays < 7) return `${diffDays}日前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}週間前`;
    return `${Math.floor(diffDays / 30)}ヶ月前`;
  };

  return (
    <div
      onClick={onClick}
      className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-amber-500 transition-all duration-200 cursor-pointer hover:shadow-lg hover:shadow-amber-500/10"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
            <span className="text-gray-900 font-semibold text-lg">
              {customer.name.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">
              {customer.name}
            </h3>
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getFrequencyColor(customer.visitFrequency)}`}
            >
              {customer.visitFrequency}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center text-amber-500 text-sm">
            <Award className="w-4 h-4 mr-1" />
            {customer.loyaltyPoints}pt
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-700/50 rounded-lg p-3">
          <div className="flex items-center text-gray-400 text-sm mb-1">
            <Calendar className="w-4 h-4 mr-1" />
            最終来店
          </div>
          <div className="text-white font-medium">
            {formatLastVisit(customer.lastVisit)}
          </div>
        </div>

        <div className="bg-gray-700/50 rounded-lg p-3">
          <div className="flex items-center text-gray-400 text-sm mb-1">
            <TrendingUp className="w-4 h-4 mr-1" />
            平均消費
          </div>
          <div className="text-white font-medium">
            ¥{customer.averageSpend.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center text-gray-400">
          <Clock className="w-4 h-4 mr-1" />
          来店回数: {customer.totalVisits}回
        </div>
        <div className="text-amber-500 font-medium">
          好み: {customer.preferredDrinks[0]}
        </div>
      </div>
    </div>
  );
};
