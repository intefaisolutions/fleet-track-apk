import axios from 'axios';

// Replace with your actual backend IP or domain
const BASE_URL = 'https://api.fleettrack.dummy/v1';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for adding token if needed
api.interceptors.request.use(
  (config) => {
    // const token = await AsyncStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Dummy API Calls for Driver Module
export const authService = {
  login: (data: any) => api.post('/driver/login', data),
};

export const dashboardService = {
  getDashboard: () => api.get('/driver/dashboard'),
};

export const expenseService = {
  getMyExpenses: () => api.get('/driver/my-expenses'),
  addExpense: (data: any) => api.post('/driver/add-expense', data),
  addRepairRequest: (data: any) => api.post('/driver/repair-request', data),
  addDailyReport: (data: any) => api.post('/driver/daily-report', data),
};

export const profileService = {
  getProfile: () => api.get('/driver/profile'),
  updateProfile: (data: any) => api.put('/driver/update-profile', data),
};
