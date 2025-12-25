import { z } from 'zod';

export const emailSchema = z.string().trim().pipe(z.email());

export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(3, { message: 'Password must be at least 3 characters' }),
});

export type LoginInput = z.input<typeof loginSchema>;
export type LoginFieldErrors = Partial<Record<keyof LoginInput, string[]>>;
export type LoginClientErrors = Partial<Record<keyof LoginInput, string>>;
export type LoginActionState = {
    error: string;
    redirectTo: string;
    fieldErrors: LoginFieldErrors;
    formErrors: string[];
};
