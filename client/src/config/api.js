// API Configuration
const API_CONFIG = {
  // Development
  development: {
    baseURL: 'http://localhost:3000',
    timeout: 10000
  },
  // Production
  production: {
    baseURL: 'https://be-khoaluan.vercel.app',
    timeout: 15000
  }
};

// Get current environment
const isDevelopment = import.meta.env.DEV;
const config = API_CONFIG[isDevelopment ? 'development' : 'production'];

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${config.baseURL}/api/auth/login`,
  REGISTER_CANDIDATE: `${config.baseURL}/api/auth/register/candidate`,
  REGISTER_EMPLOYER: `${config.baseURL}/api/auth/register/employer`,
  
  // Jobs
  JOBS_ALL: `${config.baseURL}/api/job/all`,
  JOBS_SEARCH: `${config.baseURL}/api/job/search`,
  JOBS_FILTER: `${config.baseURL}/api/job/filter`,
  JOBS_FEATURED: `${config.baseURL}/api/job/featured`,
  JOBS_LATEST: `${config.baseURL}/api/job/latest`,
  JOBS_MANAGE: `${config.baseURL}/api/job/manage`,
  
  // Categories
  CATEGORIES: `${config.baseURL}/api/admin/category-management`,
  
  // Profile
  CANDIDATE_PROFILE: `${config.baseURL}/api/candidate/profile`,
  EMPLOYER_PROFILE: `${config.baseURL}/api/employer/profile`,
  
  // Admin
  ADMIN_EMPLOYER_MANAGEMENT: `${config.baseURL}/api/admin/employer-management`,
  
  // Upload
  UPLOAD_LOGO: `${config.baseURL}/api/upload/logo`
};

// API Helper Functions
export const apiCall = async (endpoint, options = {}) => {
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: config.timeout,
    ...options
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    const response = await fetch(endpoint, {
      ...defaultOptions,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
};

// Cached API calls
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const cachedApiCall = async (endpoint, options = {}) => {
  const cacheKey = `${endpoint}-${JSON.stringify(options)}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  const data = await apiCall(endpoint, options);
  cache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });

  return data;
};

export default API_ENDPOINTS; 