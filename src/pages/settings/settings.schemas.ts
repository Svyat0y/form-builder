import { z } from 'zod'

// Profile — name rules mirror the backend RegisterDto (see auth.schemas)
export const profileSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'At least 2 characters')
    .max(50, 'Max 50 characters')
    .regex(
      /^[a-zA-Zа-яА-ЯёЁ\s'-]+$/,
      'Letters, spaces, hyphens and apostrophes only',
    ),
})

const newPasswordRule = z
  .string()
  .min(1, 'Password is required')
  .min(6, 'At least 6 characters')
  .max(16, 'Max 16 characters')
  .regex(/[a-z]/, 'Needs a lowercase letter')
  .regex(/[A-Z]/, 'Needs an uppercase letter')
  .regex(/\d/, 'Needs a number')

// Change password — new password rules mirror the register password rules
export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: newPasswordRule,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

// Set password — for social-login accounts that don't have one yet
export const setPasswordSchema = z
  .object({
    newPassword: newPasswordRule,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type ProfileFields = z.infer<typeof profileSchema>
export type PasswordFields = z.infer<typeof passwordSchema>
export type SetPasswordFields = z.infer<typeof setPasswordSchema>
