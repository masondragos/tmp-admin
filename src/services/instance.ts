/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios";

export interface ApiError {
  message: string
  status?: number
  originalError?: unknown
}
export const stage: "dev" | "test" | "prod" = "dev";
export const BASE_ENDPOINTS = {
  dev: "http://localhost:4000/api/v1",
  prod: "https://api.themortgageplatform.com/api/v1",
  test: "https://mortgage-broker-apis-eta.vercel.app/api/v1",
};
const base_endpoint = BASE_ENDPOINTS[stage];
const Instance = axios.create({
  baseURL: base_endpoint,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

Instance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Create a standardized error object
    const apiError: ApiError = {
      message: "An unexpected error occurred",
      status: error.response?.status,
      originalError: error,
    }

    // Handle backend error format: { "error": "Invalid email or password" }
    if (error.response?.data) {
      try {
        const data = error.response.data as any

        // Check if the error matches our expected format
        if (data.error && typeof data.error === "string") {
          apiError.message = data.error
        }
      } catch (parseError) {
        // If parsing fails, keep the default error message
        console.error("Error parsing API error response:", parseError)
      }
    }

    // For network errors
    if (error.message === "Network Error") {
      apiError.message = "Unable to connect to the server. Please check your internet connection."
    }

    // For timeout errors
    if (error.code === "ECONNABORTED") {
      apiError.message = "Request timed out. Please try again."
    }

    return Promise.reject(apiError)
  },
)

Instance.interceptors.request.use(
  (config) => {
    // Debug logging for production cookie issues
    if (typeof window !== 'undefined') {
      console.log('Request Config:', {
        url: config.url,
        method: config.method,
        withCredentials: config.withCredentials,
        headers: config.headers,
        cookies: document.cookie
      });
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

Instance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    // Handle 401 Unauthorized errors (token expired)
    console.log("From interceptor", error)
    if (error && error.message === "Invalid or expired token") {
      try {
        await Instance.post('/auth/logout')
        window.location.reload()
      } catch (logoutError) {
        // Optionally handle logout error
        console.error('Seller logout failed:', logoutError);
        // Fallback: call Next.js API to clear cookies
        try {
          await fetch('/api/logout', { method: 'GET' })
          window.location.reload()
        } catch (nextLogoutError) {
          console.error('Next.js logout failed:', nextLogoutError)
        }
      }
    }

    return Promise.reject(error)
  },
)

export {Instance}
