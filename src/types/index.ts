/**
 * Common TypeScript type definitions for the application
 */

// API Response Types
export interface ApiResponse<T = any> {
  status?: number;
  respondStatus: "SUCCESS" | "ERROR";
  requestedData?: T;
  requestHeader?: {
    post?: any[];
    get?: any[];
    var?: Record<string, any>;
    header?: Record<string, any>;
  };
  errorMessages?: ErrorMessage;
}

export interface ErrorMessage {
  ErrorType: string;
  Errors: string | string[];
}

// User Types
export interface UserDetails {
  userID: string;
  userFullName: string;
  adminEmail: string;
  typeID: string;
  userType: string;
  LoggedOn: string;
  permissionCategories: string;
  permissionProducts: string;
  permissionOrders: string;
  permissionUsers: string;
  permissionReports: string;
}

export interface LoginResponse {
  userDetails: UserDetails;
  JWT_Token: string;
}

// Auth Types
export interface AuthState {
  user: UserDetails | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Category Types
export interface Category {
  categoryID?: string;
  categoryName: string;
  categoryDescription?: string;
  categoryImage?: string;
  status?: string;
  [key: string]: any;
}

// Product Types
export interface Product {
  productID?: string;
  productName: string;
  productDescription?: string;
  productPrice?: string;
  categoryID?: string;
  productImage?: string;
  status?: string;
  [key: string]: any;
}

// Order Types
export interface Order {
  orderID?: string;
  orderDate?: string;
  customerID?: string;
  totalAmount?: string;
  status?: string;
  [key: string]: any;
}

// Booking Types
export interface Booking {
  bookingID?: string;
  bookingDate?: string;
  customerID?: string;
  status?: string;
  [key: string]: any;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  [key: string]: any;
}

// API Hook Types
export interface UseApiReturn<T = any> {
  data: T | null;
  errorStatus: boolean;
  errorMessage: string;
  loading: boolean;
  requestCalled: boolean;
  request: (...args: any[]) => Promise<{
    ok: boolean;
    data?: T;
    error?: string;
    [key: string]: any;
  }>;
  reset: () => void;
}

