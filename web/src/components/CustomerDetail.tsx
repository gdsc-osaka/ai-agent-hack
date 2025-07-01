"use client";

import React, { useState } from "react";
import { Customer } from "@/lib/types";
import { OrderHistory } from "./OrderHistory";
import { WordCloud } from "./WordCloud";
import {
  ArrowLeft,
  User,
  Calendar,
  TrendingUp,
  Award,
  MessageSquare,
  Clock,
  DollarSign,
  Edit,
  Save,
  X,
} from "lucide-react";

interface CustomerDetailProps {
  customer: Customer;
  onBack: () => void;
}

export const CustomerDetail: React.FC<CustomerDetailProps> = ({
  customer,
  onBack,
}) => {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(customer.notes || "");

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

  const handleSaveNotes = () => {
    // In a real app, this would save to the database
    setIsEditingNotes(false);
  };

  const handleCancelEdit = () => {
    setNotes(customer.notes || "");
    setIsEditingNotes(false);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>顧客一覧に戻る</span>
            </button>

            <div className="flex items-center space-x-4">
              <div className="flex items-center text-amber-500">
                <Award className="w-5 h-5 mr-2" />
                <span className="font-semibold">
                  {customer.loyaltyPoints}pt
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Customer Profile Header */}
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                <span className="text-gray-900 font-bold text-2xl">
                  {customer.name.charAt(0)}
                </span>
              </div>

              <div>
                <h1 className="text-white text-3xl font-bold mb-2">
                  {customer.name}
                </h1>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getFrequencyColor(customer.visitFrequency)}`}
                >
                  {customer.visitFrequency} Customer
                </span>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center text-gray-400 mb-2">
                  <Calendar className="w-4 h-4 mr-1" />
                </div>
                <div className="text-white font-semibold">
                  {formatLastVisit(customer.lastVisit)}
                </div>
                <div className="text-gray-400 text-sm">最終来店</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center text-gray-400 mb-2">
                  <Clock className="w-4 h-4 mr-1" />
                </div>
                <div className="text-white font-semibold">
                  {customer.totalVisits}回
                </div>
                <div className="text-gray-400 text-sm">来店回数</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center text-gray-400 mb-2">
                  <DollarSign className="w-4 h-4 mr-1" />
                </div>
                <div className="text-white font-semibold">
                  ¥{customer.averageSpend.toLocaleString()}
                </div>
                <div className="text-gray-400 text-sm">平均消費</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center text-gray-400 mb-2">
                  <TrendingUp className="w-4 h-4 mr-1" />
                </div>
                <div className="text-white font-semibold">
                  {customer.loyaltyPoints}
                </div>
                <div className="text-gray-400 text-sm">ポイント</div>
              </div>
            </div>
          </div>
        </div>

        {/* Preferred Drinks */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <h3 className="text-white font-semibold text-lg mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            好みの飲み物
          </h3>
          <div className="flex flex-wrap gap-3">
            {customer.preferredDrinks.map((drink, index) => (
              <span
                key={index}
                className="bg-amber-500/20 text-amber-400 px-4 py-2 rounded-full text-sm font-medium border border-amber-500/30"
              >
                {drink}
              </span>
            ))}
          </div>
        </div>

        {/* Notes Section */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-lg flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              メモ
            </h3>
            {!isEditingNotes ? (
              <button
                onClick={() => setIsEditingNotes(true)}
                className="flex items-center space-x-2 text-amber-500 hover:text-amber-400 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>編集</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveNotes}
                  className="flex items-center space-x-1 text-green-500 hover:text-green-400 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>保存</span>
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center space-x-1 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>キャンセル</span>
                </button>
              </div>
            )}
          </div>

          {isEditingNotes ? (
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-gray-700 text-white p-4 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
              rows={4}
              placeholder="顧客に関するメモを入力してください..."
            />
          ) : (
            <div className="bg-gray-700/50 rounded-lg p-4 min-h-24">
              {notes ? (
                <p className="text-gray-300 leading-relaxed">{notes}</p>
              ) : (
                <p className="text-gray-500 italic">
                  メモはまだありません。編集ボタンをクリックして追加してください。
                </p>
              )}
            </div>
          )}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Word Cloud */}
          <WordCloud topics={customer.conversationTopics} />

          {/* Order History */}
          <OrderHistory orders={customer.orders} />
        </div>
      </div>
    </div>
  );
};
