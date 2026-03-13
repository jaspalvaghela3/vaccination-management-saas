import * as yup from 'yup';
import { UserRole } from '../types';

export const loginSchema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  role: yup
    .mixed<UserRole>()
    .oneOf(['doctor', 'parent'] as UserRole[], 'Please select a valid role')
    .required('Role is required'),
});

export const registerDoctorSchema = yup.object({
  firstName: yup.string().min(2, 'First name must be at least 2 characters').required('First name is required'),
  lastName: yup.string().min(2, 'Last name must be at least 2 characters').required('Last name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  licenseNumber: yup.string().required('License number is required'),
  specialization: yup.string().required('Specialization is required'),
  clinicName: yup.string().required('Clinic name is required'),
  clinicAddress: yup.string().required('Clinic address is required'),
  phone: yup
    .string()
    .matches(/^[+]?[\d\s\-().]{7,15}$/, 'Invalid phone number')
    .required('Phone number is required'),
});

export const registerParentSchema = yup.object({
  firstName: yup.string().min(2, 'First name must be at least 2 characters').required('First name is required'),
  lastName: yup.string().min(2, 'Last name must be at least 2 characters').required('Last name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  phone: yup
    .string()
    .matches(/^[+]?[\d\s\-().]{7,15}$/, 'Invalid phone number')
    .required('Phone number is required'),
  address: yup.string().required('Address is required'),
});

export const forgotPasswordSchema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
});

export const addChildSchema = yup.object({
  firstName: yup.string().min(2, 'First name must be at least 2 characters').required('First name is required'),
  lastName: yup.string().min(2, 'Last name must be at least 2 characters').required('Last name is required'),
  dateOfBirth: yup
    .string()
    .required('Date of birth is required')
    .test('is-past', 'Date of birth must be in the past', (value) => {
      if (!value) return false;
      return new Date(value) < new Date();
    }),
  gender: yup
    .mixed<'male' | 'female'>()
    .oneOf(['male', 'female'] as Array<'male' | 'female'>, 'Please select a valid gender')
    .required('Gender is required'),
  bloodType: yup.string().optional(),
  allergies: yup.string().optional(),
  medicalNotes: yup.string().optional(),
});

export const vaccinationFormSchema = yup.object({
  childId: yup.string().required('Child is required'),
  vaccineId: yup.string().required('Vaccine is required'),
  scheduledDate: yup.string().required('Scheduled date is required'),
  administeredDate: yup.string().optional(),
  batchNumber: yup.string().optional(),
  notes: yup.string().optional(),
  sideEffects: yup.string().optional(),
  doseNumber: yup.number().min(1, 'Dose number must be at least 1').required('Dose number is required'),
});
