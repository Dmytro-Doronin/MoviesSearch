'use server';

import { z } from 'zod';

import {
    SignUpActionState,
    SignUpFieldErrors,
    signUpSchema,
} from '@/features/auth/schemas/signUpSchema';

export const signUpAction = async (
    state: SignUpActionState,
    formData: FormData,
): Promise<SignUpActionState> => {
    const zodResult = signUpSchema.safeParse(Object.fromEntries(formData));

    if (!zodResult.success) {
        const { fieldErrors, formErrors } = z.flattenError(zodResult.error);

        return {
            error: '',
            redirectTo: '',
            fieldErrors: fieldErrors as SignUpFieldErrors,
            formErrors,
        };
    }

    const { email, password, login } = zodResult.data;

    const result = await fetch('http://localhost:3000/auth/registration', {
        method: 'POST',
        body: JSON.stringify({ password, email, login }),
        headers: { 'Content-Type': 'application/json' },
    });

    if (!result.ok) {
        return {
            error: 'Invalid credentials',
            redirectTo: '',
            fieldErrors: {},
            formErrors: [],
        };
    }

    return {
        error: '',
        redirectTo: '/login',
        fieldErrors: {},
        formErrors: [],
    };
};
