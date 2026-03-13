import { format, formatDistanceToNow, isAfter, isBefore, parseISO, differenceInMonths } from 'date-fns';

export const formatDate = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy');
  } catch {
    return dateString;
  }
};

export const formatDateTime = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy HH:mm');
  } catch {
    return dateString;
  }
};

export const formatRelativeTime = (dateString: string): string => {
  try {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
  } catch {
    return dateString;
  }
};

export const isOverdue = (scheduledDate: string): boolean => {
  try {
    return isBefore(parseISO(scheduledDate), new Date());
  } catch {
    return false;
  }
};

export const isUpcoming = (scheduledDate: string, daysAhead: number = 30): boolean => {
  try {
    const date = parseISO(scheduledDate);
    const future = new Date();
    future.setDate(future.getDate() + daysAhead);
    return isAfter(date, new Date()) && isBefore(date, future);
  } catch {
    return false;
  }
};

export const getAgeInMonths = (dateOfBirth: string): number => {
  try {
    return differenceInMonths(new Date(), parseISO(dateOfBirth));
  } catch {
    return 0;
  }
};

export const getAgeDisplay = (dateOfBirth: string): string => {
  const months = getAgeInMonths(dateOfBirth);
  if (months < 12) {
    return `${months} month${months !== 1 ? 's' : ''}`;
  }
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0) {
    return `${years} year${years !== 1 ? 's' : ''}`;
  }
  return `${years}y ${remainingMonths}m`;
};

export const toInputDateFormat = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'yyyy-MM-dd');
  } catch {
    return '';
  }
};

export const todayInputFormat = (): string => format(new Date(), 'yyyy-MM-dd');
