import { z } from 'zod'

// Login — only required checks; format is validated by the server
export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Register — mirrors backend RegisterDto rules
export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'At least 2 characters')
    .max(50, 'Max 50 characters')
    .regex(
      /^[a-zA-Zа-яА-ЯёЁ\s'-]+$/,
      'Letters, spaces, hyphens and apostrophes only',
    ),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .max(255, 'Email is too long'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'At least 6 characters')
    .max(16, 'Max 16 characters')
    .regex(/[a-z]/, 'Needs a lowercase letter')
    .regex(/[A-Z]/, 'Needs an uppercase letter')
    .regex(/\d/, 'Needs a number'),
})

export type LoginFields = z.infer<typeof loginSchema>
export type RegisterFields = z.infer<typeof registerSchema>
export type FormErrors<T> = Partial<Record<keyof T, string>>

// Returns the first error per field, or null if valid
export function validateForm<T extends Record<string, unknown>>(
  schema: z.ZodType<T>,
  data: unknown,
): FormErrors<T> | null {
  const result = schema.safeParse(data)
  if (result.success) return null

  const errors: FormErrors<T> = {}
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof T
    if (field && !errors[field]) {
      errors[field] = issue.message
    }
  }
  return errors
}
