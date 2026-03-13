import crypto from 'crypto';

const AVERAGE_DAYS_PER_MONTH = 30.44;

export function calculateVaccineDueDate(dob: Date, ageMonths: number): Date {
  const dueDate = new Date(dob);
  const days = Math.round(ageMonths * AVERAGE_DAYS_PER_MONTH);
  dueDate.setDate(dueDate.getDate() + days);
  return dueDate;
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function isOverdue(date: Date): boolean {
  return date < new Date();
}

export function generatePasswordResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function generateEmailVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}
