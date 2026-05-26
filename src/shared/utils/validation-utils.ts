import { z } from 'zod';

/**
 * UUID validation schema
 */
export const uuidSchema = z.string().uuid();

/**
 * ISO date string validation schema
 */
export const isoDateSchema = z.string().datetime();

/**
 * Positive number validation schema
 */
export const positiveNumberSchema = z.number().positive();

/**
 * Non-negative number validation schema
 */
export const nonNegativeNumberSchema = z.number().nonnegative();

/**
 * Email validation schema
 */
export const emailSchema = z.string().email();

/**
 * Transaction type validation schema
 */
export const transactionTypeSchema = z.enum(['income', 'expense', 'transfer']);

/**
 * Account type validation schema
 */
export const accountTypeSchema = z.enum(['checking', 'savings', 'credit', 'cash', 'investment']);

/**
 * Category type validation schema
 */
export const categoryTypeSchema = z.enum(['income', 'expense']);

/**
 * Budget period validation schema
 */
export const budgetPeriodSchema = z.enum(['monthly', 'quarterly', 'yearly']);

/**
 * Frequency validation schema
 */
export const frequencySchema = z.enum(['daily', 'weekly', 'monthly', 'yearly']);

/**
 * Asset type validation schema
 */
export const assetTypeSchema = z.enum(['stock', 'bond', 'mutual_fund', 'etf', 'crypto', 'other']);

/**
 * Currency code validation schema (ISO 4217)
 */
export const currencySchema = z.string().length(3).toUpperCase();

/**
 * Validate UUID
 */
export const isValidUUID = (value: string): boolean => {
  return uuidSchema.safeParse(value).success;
};

/**
 * Validate ISO date string
 */
export const isValidISODate = (value: string): boolean => {
  return isoDateSchema.safeParse(value).success;
};

/**
 * Validate positive number
 */
export const isPositiveNumber = (value: number): boolean => {
  return positiveNumberSchema.safeParse(value).success;
};

/**
 * Validate email
 */
export const isValidEmail = (value: string): boolean => {
  return emailSchema.safeParse(value).success;
};

/**
 * Generate UUID v4
 */
export const generateUUID = (): string => {
  return crypto.randomUUID();
};

/**
 * Validate string length
 */
export const isValidLength = (value: string, min: number, max: number): boolean => {
  return value.length >= min && value.length <= max;
};

/**
 * Validate required field
 */
export const isRequired = (value: unknown): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
};

/**
 * Sanitize string input
 */
export const sanitizeString = (value: string): string => {
  return value.trim().replace(/\s+/g, ' ');
};

/**
 * Validate percentage (0-100)
 */
export const isValidPercentage = (value: number): boolean => {
  return value >= 0 && value <= 100;
};

/**
 * Validate amount (2 decimal places max)
 */
export const isValidAmount = (value: number): boolean => {
  const rounded = Math.round(value * 100) / 100;
  return rounded === value && value >= 0;
};

// Made with Bob
