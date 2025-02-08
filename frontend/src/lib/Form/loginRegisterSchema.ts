import * as z from "zod";

export const loginSchema = z.object({
  username: z.string().max(255),
  password: z.string().min(4),
});

export const registerSchema = z
  .object({
    username: z.string().max(255),
    first_name: z.string().max(255),
    last_name: z.string().max(255),
    email: z.string().email(),
    password: z.string().min(4),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });
