/**
 * API-specific type definitions
 */

import { ApiResponse, UserDetails, Category, Product, Order, Booking } from "./index";

// Re-export ApiResponse for convenience
export type { ApiResponse };

// Auth API Types
export interface LoginRequest {
  username: string;
  password: string;
  devicetype?: string;
}

export type LoginApiResponse = ApiResponse<{
  userDetails: UserDetails;
  JWT_Token: string;
}>;

// Category API Types
export type CategoryApiResponse = ApiResponse<Category[]>;
export type SingleCategoryApiResponse = ApiResponse<Category>;

// Product API Types
export type ProductApiResponse = ApiResponse<Product[]>;
export type SingleProductApiResponse = ApiResponse<Product>;

// Order API Types
export type OrderApiResponse = ApiResponse<Order[]>;
export type SingleOrderApiResponse = ApiResponse<Order>;

// Booking API Types
export type BookingApiResponse = ApiResponse<Booking[]>;
export type SingleBookingApiResponse = ApiResponse<Booking>;

// Generic API Function Type
export type ApiFunction<T = any> = (...args: any[]) => Promise<{
  ok: boolean;
  status?: number;
  data: T;
  problem?: string | null;
}>;

