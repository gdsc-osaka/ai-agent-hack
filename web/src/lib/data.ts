import { Customer } from "./types";

export const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "田中太郎",
    visitFrequency: "VIP",
    preferredDrinks: ["オールドファッションド", "マッカラン18年", "赤ワイン"],
    lastVisit: "2024-01-15",
    totalVisits: 47,
    averageSpend: 8500,
    loyaltyPoints: 2350,
    conversationTopics: [
      {
        text: "ゴルフ",
        frequency: 15,
        category: "lifestyle",
        lastMentioned: "2024-01-15",
      },
      {
        text: "出張",
        frequency: 12,
        category: "business",
        lastMentioned: "2024-01-12",
      },
      {
        text: "ワイン",
        frequency: 10,
        category: "food",
        lastMentioned: "2024-01-15",
      },
      {
        text: "家族",
        frequency: 8,
        category: "personal",
        lastMentioned: "2024-01-10",
      },
      {
        text: "映画",
        frequency: 6,
        category: "entertainment",
        lastMentioned: "2024-01-08",
      },
      {
        text: "旅行",
        frequency: 5,
        category: "travel",
        lastMentioned: "2024-01-05",
      },
    ],
    orders: [
      {
        id: "o1",
        date: "2024-01-15",
        items: [
          {
            name: "オールドファッションド",
            category: "cocktail",
            price: 1200,
            quantity: 2,
          },
          { name: "ナッツ", category: "food", price: 500, quantity: 1 },
        ],
        total: 2900,
        duration: 120,
      },
    ],
    notes: "毎週金曜日に来店。ゴルフの話題で盛り上がる。",
  },
  {
    id: "2",
    name: "佐藤花子",
    visitFrequency: "Regular",
    preferredDrinks: ["ジントニック", "シャンパン", "カクテル"],
    lastVisit: "2024-01-14",
    totalVisits: 23,
    averageSpend: 4200,
    loyaltyPoints: 960,
    conversationTopics: [
      {
        text: "ファッション",
        frequency: 12,
        category: "lifestyle",
        lastMentioned: "2024-01-14",
      },
      {
        text: "仕事",
        frequency: 10,
        category: "business",
        lastMentioned: "2024-01-14",
      },
      {
        text: "カクテル",
        frequency: 8,
        category: "food",
        lastMentioned: "2024-01-14",
      },
      {
        text: "友人",
        frequency: 7,
        category: "personal",
        lastMentioned: "2024-01-12",
      },
      {
        text: "音楽",
        frequency: 5,
        category: "entertainment",
        lastMentioned: "2024-01-10",
      },
    ],
    orders: [
      {
        id: "o2",
        date: "2024-01-14",
        items: [
          {
            name: "ジントニック",
            category: "cocktail",
            price: 900,
            quantity: 3,
          },
          { name: "オリーブ", category: "food", price: 400, quantity: 1 },
        ],
        total: 3100,
        duration: 90,
      },
    ],
    notes: "友人とよく来店。新しいカクテルに興味あり。",
  },
  {
    id: "3",
    name: "山田一郎",
    visitFrequency: "Occasional",
    preferredDrinks: ["ビール", "ハイボール"],
    lastVisit: "2024-01-08",
    totalVisits: 8,
    averageSpend: 2800,
    loyaltyPoints: 224,
    conversationTopics: [
      {
        text: "野球",
        frequency: 6,
        category: "entertainment",
        lastMentioned: "2024-01-08",
      },
      {
        text: "仕事",
        frequency: 4,
        category: "business",
        lastMentioned: "2024-01-08",
      },
      {
        text: "ビール",
        frequency: 3,
        category: "food",
        lastMentioned: "2024-01-08",
      },
    ],
    orders: [
      {
        id: "o3",
        date: "2024-01-08",
        items: [
          {
            name: "プレミアムビール",
            category: "beer",
            price: 800,
            quantity: 2,
          },
          { name: "ハイボール", category: "cocktail", price: 700, quantity: 1 },
        ],
        total: 2300,
        duration: 60,
      },
    ],
  },
];
