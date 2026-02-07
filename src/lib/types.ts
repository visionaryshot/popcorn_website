// Database types for Supabase
// This should match your Supabase database schema

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string;
          customer_name: string;
          whatsapp_number: string;
          cohort: string;
          nickname: string;
          total_amount: number;
          status: 'Pending' | 'Confirmed' | 'Cancelled';
          proof_of_payment_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          whatsapp_number: string;
          cohort: string;
          nickname: string;
          total_amount: number;
          status?: 'Pending' | 'Confirmed' | 'Cancelled';
          proof_of_payment_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          whatsapp_number?: string;
          cohort?: string;
          nickname?: string;
          total_amount?: number;
          status?: 'Pending' | 'Confirmed' | 'Cancelled';
          proof_of_payment_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["id"];
            referencedRelation: "orders";
            referencedColumns: ["id"];
          }
        ];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_name: string;
          quantity: number;
          unit_price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_name: string;
          quantity: number;
          unit_price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_name?: string;
          quantity?: number;
          unit_price?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            referencedRelation: "orders";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Cart item type
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// Order type for API responses (includes items)
export interface Order {
  id: string;
  customer_name: string;
  whatsapp_number: string;
  cohort: string;
  nickname: string;
  total_amount: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  proof_of_payment_url: string | null;
  created_at: string;
  updated_at?: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id?: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  created_at?: string;
}

// Product type
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'butter' | 'cheese' | 'caramel';
}

// Admin login response
export interface AdminResponse {
  success: boolean;
  message: string;
}

