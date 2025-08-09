export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface ProfileFormData {
  first_name: string;
  last_name: string;
  display_name: string;
  email: string;
  phone: string;
  bio: string;
}

export interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export class ValidationError extends Error {
  constructor(public errors: string[]) {
    super(errors.join(', '));
    this.name = 'ValidationError';
  }
}

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  if (!phone) return true;
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length >= 10 && digitsOnly.length <= 15;
};

export const validatePasswordStrength = (password: string): ValidationResult => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/(?=.*[!@#$%^&*])/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateProfileForm = (data: Partial<ProfileFormData>): ValidationResult => {
  const errors: string[] = [];
  
  if (data.first_name !== undefined) {
    if (!data.first_name.trim()) {
      errors.push('First name is required');
    } else if (data.first_name.trim().length < 2) {
      errors.push('First name must be at least 2 characters long');
    } else if (data.first_name.trim().length > 50) {
      errors.push('First name must be less than 50 characters');
    }
  }
  
  if (data.last_name !== undefined) {
    if (!data.last_name.trim()) {
      errors.push('Last name is required');
    } else if (data.last_name.trim().length < 2) {
      errors.push('Last name must be at least 2 characters long');
    } else if (data.last_name.trim().length > 50) {
      errors.push('Last name must be less than 50 characters');
    }
  }
  
  if (data.display_name !== undefined && data.display_name) {
    if (data.display_name.trim().length < 2) {
      errors.push('Display name must be at least 2 characters long');
    } else if (data.display_name.trim().length > 30) {
      errors.push('Display name must be less than 30 characters');
    }
  }
  
  if (data.email !== undefined) {
    if (!data.email.trim()) {
      errors.push('Email is required');
    } else if (!isValidEmail(data.email)) {
      errors.push('Please enter a valid email address');
    }
  }
  
  if (data.phone !== undefined && data.phone && !isValidPhone(data.phone)) {
    errors.push('Please enter a valid phone number');
  }
  
  if (data.bio !== undefined && data.bio && data.bio.length > 500) {
    errors.push('Bio must be less than 500 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validatePasswordChange = (data: PasswordFormData): ValidationResult => {
  const errors: string[] = [];
  
  if (!data.currentPassword) {
    errors.push('Current password is required');
  }
  
  if (!data.newPassword) {
    errors.push('New password is required');
  } else {
    const passwordValidation = validatePasswordStrength(data.newPassword);
    if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.errors);
    }
  }
  
  if (!data.confirmPassword) {
    errors.push('Please confirm your new password');
  } else if (data.newPassword !== data.confirmPassword) {
    errors.push('New passwords do not match');
  }
  
  if (data.currentPassword && data.newPassword && data.currentPassword === data.newPassword) {
    errors.push('New password must be different from current password');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const sanitizeInput = (value: string): string => {
  return value.trim().replace(/\s+/g, ' ');
};

export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  const digitsOnly = phone.replace(/\D/g, '');
  
  if (digitsOnly.length === 10) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
  } else if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
    return `+1 (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7)}`;
  }
  
  return phone;
};

export const hasProfileChanges = (
  original: Partial<ProfileFormData>, 
  current: Partial<ProfileFormData>
): boolean => {
  const fields = ['first_name', 'last_name', 'display_name', 'email', 'phone', 'bio'] as const;
  
  return fields.some(field => {
    const originalValue = original[field] || '';
    const currentValue = current[field] || '';
    return sanitizeInput(originalValue) !== sanitizeInput(currentValue);
  });
};
