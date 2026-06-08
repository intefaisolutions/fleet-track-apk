import axios, { type AxiosResponse } from 'axios';
import { API_BASE_URL } from '../config/api';

export interface ApiEnvelope<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export function unwrapApi<T>(response: AxiosResponse<ApiEnvelope<T>>): T {
  const body = response.data;
  if (!body?.success) {
    throw new Error(body?.message || 'Request failed');
  }
  return body.data as T;
}

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiEnvelope | undefined;
    const msg = data?.message;
    if (typeof msg === 'string' && msg.trim()) return msg;
    if (error.message) return error.message;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export const authService = {
  login: (data: { email: string; password: string }) =>
    api.post<ApiEnvelope>('/driver/login', data),
  forgotPassword: (data: { email: string }) =>
    api.post<ApiEnvelope>('/auth/forgot-password', data),
  verifyResetOtp: (data: { email: string; otp: string }) =>
    api.post<ApiEnvelope>('/auth/verify-reset-otp', data),
  resetPassword: (data: { email: string; token: string; newPassword: string }) =>
    api.post<ApiEnvelope>('/auth/reset-password', data),
};

export const dashboardService = {
  getDashboard: () => api.get<ApiEnvelope>('/driver/dashboard'),
};

export const expenseService = {
  getMyExpenses: () => api.get<ApiEnvelope>('/driver/my-expenses'),
  updateExpense: (
    id: string,
    data: { amount: number; description: string; expenseDate: string },
  ) => api.patch<ApiEnvelope>(`/driver/expenses/${id}`, data),
  addExpense: (data: Record<string, unknown>) =>
    api.post<ApiEnvelope>('/driver/add-expense', data),
  addRepairRequest: (data: Record<string, unknown>) =>
    api.post<ApiEnvelope>('/driver/repair-request', data),
  addDailyReport: (data: Record<string, unknown>) =>
    api.post<ApiEnvelope>('/driver/daily-report', data),
};

export const profileService = {
  getProfile: () => api.get<ApiEnvelope>('/driver/profile'),
  updateProfile: (data: { fullName: string }) =>
    api.put<ApiEnvelope>('/driver/update-profile', data),
};
