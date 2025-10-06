import * as yup from 'yup';
import { VALIDATION_MESSAGES } from '../types';

// Email validation
export const emailSchema = yup
  .string()
  .email(VALIDATION_MESSAGES.EMAIL)
  .required(VALIDATION_MESSAGES.REQUIRED);

// Password validation
export const passwordSchema = yup
  .string()
  .min(8, VALIDATION_MESSAGES.MIN_LENGTH(8))
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  )
  .required(VALIDATION_MESSAGES.REQUIRED);

// Login form schema
export const loginSchema = yup.object({
  email: emailSchema,
  password: yup.string().required(VALIDATION_MESSAGES.REQUIRED),
  remember: yup.boolean()
});

// Registration form schema
export const registerSchema = yup.object({
  name: yup
    .string()
    .min(2, VALIDATION_MESSAGES.MIN_LENGTH(2))
    .max(50, VALIDATION_MESSAGES.MAX_LENGTH(50))
    .required(VALIDATION_MESSAGES.REQUIRED),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], VALIDATION_MESSAGES.PASSWORD_MATCH)
    .required(VALIDATION_MESSAGES.REQUIRED),
  acceptTerms: yup
    .boolean()
    .oneOf([true], 'You must accept the terms and conditions')
});

// Project form schema
export const projectSchema = yup.object({
  name: yup
    .string()
    .min(3, VALIDATION_MESSAGES.MIN_LENGTH(3))
    .max(100, VALIDATION_MESSAGES.MAX_LENGTH(100))
    .required(VALIDATION_MESSAGES.REQUIRED),
  description: yup
    .string()
    .max(500, VALIDATION_MESSAGES.MAX_LENGTH(500)),
  type: yup.string().required(VALIDATION_MESSAGES.REQUIRED),
  dueDate: yup
    .date()
    .min(new Date(), 'Due date must be in the future')
    .required(VALIDATION_MESSAGES.REQUIRED),
  color: yup.string()
});

// Brand message form schema
export const brandMessageSchema = yup.object({
  title: yup
    .string()
    .min(3, VALIDATION_MESSAGES.MIN_LENGTH(3))
    .max(100, VALIDATION_MESSAGES.MAX_LENGTH(100))
    .required(VALIDATION_MESSAGES.REQUIRED),
  type: yup.string().required(VALIDATION_MESSAGES.REQUIRED),
  content: yup
    .string()
    .min(10, VALIDATION_MESSAGES.MIN_LENGTH(10))
    .max(1000, VALIDATION_MESSAGES.MAX_LENGTH(1000))
    .required(VALIDATION_MESSAGES.REQUIRED),
  projectId: yup.string().required('Please select a project')
});

// Copy form schema
export const copySchema = yup.object({
  title: yup
    .string()
    .min(3, VALIDATION_MESSAGES.MIN_LENGTH(3))
    .max(100, VALIDATION_MESSAGES.MAX_LENGTH(100))
    .required(VALIDATION_MESSAGES.REQUIRED),
  platform: yup.string().required(VALIDATION_MESSAGES.REQUIRED),
  format: yup.string().required(VALIDATION_MESSAGES.REQUIRED),
  content: yup.string().required(VALIDATION_MESSAGES.REQUIRED),
  hashtags: yup.array().of(yup.string())
});

// Profile update schema
export const profileSchema = yup.object({
  name: yup
    .string()
    .min(2, VALIDATION_MESSAGES.MIN_LENGTH(2))
    .max(50, VALIDATION_MESSAGES.MAX_LENGTH(50))
    .required(VALIDATION_MESSAGES.REQUIRED),
  email: emailSchema,
  phone: yup.string().matches(
    /^(\+\d{1,3}[- ]?)?\d{10}$/,
    VALIDATION_MESSAGES.INVALID_PHONE
  ),
  bio: yup.string().max(500, VALIDATION_MESSAGES.MAX_LENGTH(500)),
  website: yup.string().url(VALIDATION_MESSAGES.INVALID_URL)
});

// Change password schema
export const changePasswordSchema = yup.object({
  currentPassword: yup.string().required(VALIDATION_MESSAGES.REQUIRED),
  newPassword: passwordSchema,
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], VALIDATION_MESSAGES.PASSWORD_MATCH)
    .required(VALIDATION_MESSAGES.REQUIRED)
});

// Payment method schema
export const paymentMethodSchema = yup.object({
  cardNumber: yup
    .string()
    .matches(/^\d{16}$/, 'Card number must be 16 digits')
    .required(VALIDATION_MESSAGES.REQUIRED),
  cardName: yup
    .string()
    .min(3, VALIDATION_MESSAGES.MIN_LENGTH(3))
    .required(VALIDATION_MESSAGES.REQUIRED),
  expMonth: yup
    .number()
    .min(1, 'Invalid month')
    .max(12, 'Invalid month')
    .required(VALIDATION_MESSAGES.REQUIRED),
  expYear: yup
    .number()
    .min(new Date().getFullYear(), 'Card is expired')
    .required(VALIDATION_MESSAGES.REQUIRED),
  cvv: yup
    .string()
    .matches(/^\d{3,4}$/, 'CVV must be 3 or 4 digits')
    .required(VALIDATION_MESSAGES.REQUIRED)
});

// Contact form schema
export const contactSchema = yup.object({
  name: yup
    .string()
    .min(2, VALIDATION_MESSAGES.MIN_LENGTH(2))
    .required(VALIDATION_MESSAGES.REQUIRED),
  email: emailSchema,
  subject: yup
    .string()
    .min(5, VALIDATION_MESSAGES.MIN_LENGTH(5))
    .required(VALIDATION_MESSAGES.REQUIRED),
  message: yup
    .string()
    .min(20, VALIDATION_MESSAGES.MIN_LENGTH(20))
    .max(1000, VALIDATION_MESSAGES.MAX_LENGTH(1000))
    .required(VALIDATION_MESSAGES.REQUIRED)
});

// Custom validation functions
export const validateEmail = (email) => {
  const re = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return re.test(email);
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return re.test(password);
};

export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validatePhone = (phone) => {
  const re = /^(\+\d{1,3}[- ]?)?\d{10}$/;
  return re.test(phone);
};

export const validateCreditCard = (number) => {
  // Luhn algorithm
  const digits = number.replace(/\D/g, '');
  let sum = 0;
  let isEven = false;
  
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

// Character limit validators
export const validateCharacterLimit = (text, limit) => {
  return text.length <= limit;
};

export const validateWordCount = (text, minWords, maxWords) => {
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  return words.length >= minWords && words.length <= maxWords;
};

// File validation
export const validateFileSize = (file, maxSizeMB) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

export const validateFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.type);
};

export const validateImageDimensions = async (file, minWidth, minHeight) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve(img.width >= minWidth && img.height >= minHeight);
    };
    img.onerror = () => resolve(false);
    img.src = URL.createObjectURL(file);
  });
};

// Platform-specific validators
export const validateTwitterLength = (text) => {
  return text.length <= 280;
};

export const validateInstagramCaption = (text) => {
  return text.length <= 2200;
};

export const validateLinkedInPost = (text) => {
  return text.length <= 3000;
};

export const validateHashtag = (hashtag) => {
  const re = /^[a-zA-Z0-9_]+$/;
  return re.test(hashtag.replace('#', ''));
};

// Form field validators with custom messages
export const getFieldError = (field, value, rules) => {
  if (rules.required && !value) {
    return VALIDATION_MESSAGES.REQUIRED;
  }
  
  if (rules.minLength && value.length < rules.minLength) {
    return VALIDATION_MESSAGES.MIN_LENGTH(rules.minLength);
  }
  
  if (rules.maxLength && value.length > rules.maxLength) {
    return VALIDATION_MESSAGES.MAX_LENGTH(rules.maxLength);
  }
  
  if (rules.pattern && !rules.pattern.test(value)) {
    return rules.patternMessage || 'Invalid format';
  }
  
  if (rules.custom && !rules.custom(value)) {
    return rules.customMessage || 'Invalid value';
  }
  
  return null;
};