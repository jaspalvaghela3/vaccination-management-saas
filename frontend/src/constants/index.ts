export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  DOCTOR_DASHBOARD: '/doctor/dashboard',
  PARENT_DASHBOARD: '/parent/dashboard',
  CHILD_DETAIL: '/parent/children/:id',
  VACCINATION_SCHEDULE: '/vaccination-schedule',
  NOT_FOUND: '/404',
} as const;

export const TOKEN_KEYS = {
  ACCESS: 'access_token',
  REFRESH: 'refresh_token',
} as const;

export const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

export const SPECIALIZATIONS = [
  'Pediatrics',
  'General Practice',
  'Family Medicine',
  'Internal Medicine',
  'Infectious Disease',
  'Public Health',
] as const;

export const VACCINATION_STATUS_COLORS: Record<string, string> = {
  completed: 'success',
  scheduled: 'info',
  overdue: 'error',
  missed: 'warning',
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
} as const;
