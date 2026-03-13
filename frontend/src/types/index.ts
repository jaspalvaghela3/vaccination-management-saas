// User & Auth Types
export type UserRole = 'doctor' | 'parent' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Doctor extends User {
  role: 'doctor';
  licenseNumber: string;
  specialization: string;
  clinicName: string;
  clinicAddress: string;
  phone: string;
}

export interface Parent extends User {
  role: 'parent';
  phone: string;
  address: string;
}

// Child Types
export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type Gender = 'male' | 'female';

export interface Child {
  id: string;
  parentId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  bloodType?: BloodType;
  allergies?: string;
  medicalNotes?: string;
  createdAt: string;
  updatedAt: string;
  vaccinationRecords?: VaccinationRecord[];
}

// Vaccine Types
export interface Vaccine {
  id: string;
  name: string;
  description: string;
  manufacturer: string;
  recommendedAgeMonths: number;
  dosesRequired: number;
  intervalDays?: number;
  isActive: boolean;
}

// Vaccination Record Types
export type VaccinationStatus = 'scheduled' | 'completed' | 'overdue' | 'missed';

export interface VaccinationRecord {
  id: string;
  childId: string;
  vaccineId: string;
  vaccine?: Vaccine;
  doctorId?: string;
  doctor?: Doctor;
  scheduledDate: string;
  administeredDate?: string;
  status: VaccinationStatus;
  doseNumber: number;
  batchNumber?: string;
  notes?: string;
  sideEffects?: string;
  nextDoseDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Notification Types
export type NotificationType = 'info' | 'warning' | 'success' | 'error';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  relatedChildId?: string;
  relatedVaccinationId?: string;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}

// Auth Form Types
export interface LoginFormInputs {
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterDoctorFormInputs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  licenseNumber: string;
  specialization: string;
  clinicName: string;
  clinicAddress: string;
  phone: string;
}

export interface RegisterParentFormInputs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
}

export interface ForgotPasswordFormInputs {
  email: string;
}

// Child Form Types
export interface AddChildFormInputs {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  bloodType?: BloodType;
  allergies?: string;
  medicalNotes?: string;
}

// Vaccination Form Types
export interface VaccinationFormInputs {
  childId: string;
  vaccineId: string;
  scheduledDate: string;
  administeredDate?: string;
  batchNumber?: string;
  notes?: string;
  sideEffects?: string;
  doseNumber: number;
}

// Dashboard Stats Types
export interface DoctorStats {
  totalPatients: number;
  vaccinationsDueToday: number;
  completedToday: number;
  overdueVaccinations: number;
}

export interface ParentStats {
  totalChildren: number;
  upcomingVaccinations: number;
  overdueVaccinations: number;
  completedVaccinations: number;
}

// Auth Token Types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
