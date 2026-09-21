import { z } from "zod";

export const PASSWORD_MIN_LENGTH = 10;

const email = z
  .string()
  .trim()
  .min(1, "Enter your email address.")
  .email("Enter a valid email address.");

const newPassword = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Use at least ${PASSWORD_MIN_LENGTH} characters.`);

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password."),
});

export const registerSchema = z
  .object({
    first_name: z.string().trim().min(1, "Enter your first name.").max(150),
    last_name: z.string().trim().min(1, "Enter your last name.").max(150),
    email,
    password: newPassword,
    password_confirm: z.string().min(1, "Confirm your password."),
  })
  .refine((values) => values.password === values.password_confirm, {
    path: ["password_confirm"],
    message: "Passwords don’t match.",
  });

export const codeSchema = z.object({
  code: z.string().regex(/^\d{6}$/, "Enter the 6-digit code from the email."),
});

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({
    code: z.string().regex(/^\d{6}$/, "Enter the 6-digit code from the email."),
    password: newPassword,
    password_confirm: z.string().min(1, "Confirm your new password."),
  })
  .refine((values) => values.password === values.password_confirm, {
    path: ["password_confirm"],
    message: "Passwords don’t match.",
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type CodeValues = z.infer<typeof codeSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
