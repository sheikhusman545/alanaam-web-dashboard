"use client";

import { create } from "apisauce";
import { getToken } from "./storage";
import appConfig from "./app-config";
import { ApiResponse } from "@/types";

/**
 * Modern API client configuration with TypeScript support
 * Client-side only - this file should never be imported in server-side code
 */
const serverConnectAPI = create({
  baseURL: `${appConfig.webServerURL}/api/admin`,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    Accept: "*/*",
  },
  timeout: 30000, // 30 second timeout
});

// Add authentication token to all requests
serverConnectAPI.addAsyncRequestTransform(async (request) => {
  const authToken = await getToken();
  if (authToken && request.headers) {
    request.headers["x-auth-token"] = authToken;
  }
});

// Add response transformation for consistent error handling
serverConnectAPI.addResponseTransform((response) => {
  if (!response.ok) {
    // Handle network errors
    if (!response.data) {
      response.data = {
        respondStatus: "ERROR",
        errorMessages: {
          ErrorType: "Network.Error",
          Errors: response.problem || "Network error occurred",
        },
      } as ApiResponse;
    }
  }
});

export default serverConnectAPI;

