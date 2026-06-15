export interface VirtualTourScene {
  sceneId: string;
  name: string;
  imageUrl: string;
  description: string;
}

export interface Agent {
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  location: string;
  country: string;
  type: "Mansion" | "Villa" | "Penthouse" | "Apartment" | "Townhouse" | string;
  bedrooms: number;
  bathrooms: number;
  area: number; // in square feet
  status: "sale" | "rent";
  images: string[];
  virtualTour?: VirtualTourScene[];
  amenities: string[];
  featured: boolean;
  agent: Agent;
  createdAt: string;
}

export interface Booking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  date: string;
  time: string;
  type: "physical" | "virtual";
  status: "pending" | "approved" | "completed" | "cancelled";
  createdAt: string;
  comments?: string;
}

export interface Inquiry {
  id: string;
  propertyId?: string;
  propertyTitle?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  message: string;
  createdAt: string;
}

export interface User {
  username: string;
  role: string;
  name: string;
}

export interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: string;
}

export type CurrencyType = "USD" | "NGN" | "GBP" | "AED" | "EUR";

export const CURRENCY_SYMBOLS: Record<CurrencyType, string> = {
  USD: "$",
  NGN: "₦",
  GBP: "£",
  AED: "AED ",
  EUR: "€"
};

export const CURRENCY_CONVERSIONS: Record<CurrencyType, number> = {
  USD: 1,
  NGN: 1500, // 1 USD = 1500 NGN
  GBP: 0.80, // 1 USD = 0.8 GBP
  AED: 3.67, // 1 USD = 3.67 AED
  EUR: 0.93  // 1 USD = 0.93 EUR
};
export interface FilterState {
  search: string;
  country: string;
  type: string;
  bedrooms: string;
  status: string;
  maxPrice: number | null;
}