export interface Customer {
  id: string;
  name: string;
  avatar?: string;
  visitFrequency: "Regular" | "Occasional" | "New" | "VIP";
  preferredDrinks: string[];
  lastVisit: string;
  totalVisits: number;
  averageSpend: number;
  conversationTopics: ConversationTopic[];
  orders: Order[];
  notes?: string;
  loyaltyPoints: number;
}

export interface ConversationTopic {
  text: string;
  frequency: number;
  category:
    | "personal"
    | "business"
    | "entertainment"
    | "lifestyle"
    | "food"
    | "travel";
  lastMentioned: string;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  duration: number; // minutes spent
}

export interface OrderItem {
  name: string;
  category: "cocktail" | "wine" | "beer" | "spirits" | "non-alcoholic" | "food";
  price: number;
  quantity: number;
}
