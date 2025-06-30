import React from "react";
import { Order } from "@/lib/types";
import { Calendar, Clock, DollarSign, ShoppingBag } from "lucide-react";

interface OrderHistoryProps {
  orders: Order[];
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({ orders }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
      weekday: "short",
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}時間${mins}分`;
    }
    return `${mins}分`;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "cocktail":
        return "bg-amber-500/20 text-amber-400";
      case "wine":
        return "bg-red-500/20 text-red-400";
      case "beer":
        return "bg-yellow-500/20 text-yellow-400";
      case "spirits":
        return "bg-orange-500/20 text-orange-400";
      case "non-alcoholic":
        return "bg-blue-500/20 text-blue-400";
      case "food":
        return "bg-green-500/20 text-green-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h3 className="text-white font-semibold text-lg mb-6">注文履歴</h3>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-gray-700/30 rounded-lg p-4 border border-gray-600"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-400 text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(order.date)}
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatDuration(order.duration)}
                </div>
              </div>
              <div className="flex items-center text-amber-500 font-semibold">
                <DollarSign className="w-4 h-4 mr-1" />¥
                {order.total.toLocaleString()}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${getCategoryColor(item.category)}`}
                >
                  <ShoppingBag className="w-3 h-3" />
                  <span>{item.name}</span>
                  {item.quantity > 1 && (
                    <span className="text-xs">×{item.quantity}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
