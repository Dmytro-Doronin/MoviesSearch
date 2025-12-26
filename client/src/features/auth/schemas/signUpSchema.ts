import { z } from 'zod';

export const emailSchema = z.string().trim().pipe(z.email());

export const signUpSchema = z.object({
    login: z
        .string()
        .min(3, { message: 'Login must be at least 3 characters' })
        .max(10, { message: 'Login must be at less then 11 characters' }),
    email: emailSchema,
    password: z.string().min(3, { message: 'Password must be at least 3 characters' }),
});

export type SignUpInput = z.input<typeof signUpSchema>;
export type SignUpFieldErrors = Partial<Record<keyof SignUpInput, string[]>>;
export type SignUpClientErrors = Partial<Record<keyof SignUpInput, string>>;
export type SignUpActionState = {
    error: string;
    redirectTo: string;
    fieldErrors: SignUpFieldErrors;
    formErrors: string[];
};
