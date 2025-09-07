/**
 * Константалар файли
 */

// API URLs
export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  USERS: '/users',
  ADMIN_USERS: '/admin/users',
  ADMIN_STATS: '/admin/stats',
};

// Роллар
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

// Статус коди
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// Лимитлар
export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Маршрутлар
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_LANGUAGES: '/admin/languages',
};

export default {
  API_ENDPOINTS,
  USER_ROLES,
  HTTP_STATUS,
  PAGINATION,
  ROUTES,
};
