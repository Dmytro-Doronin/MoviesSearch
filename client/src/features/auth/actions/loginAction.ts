'use server';

import { cookies } from 'next/headers';
import { z } from 'zod';

import { parseCookies } from '@/helpers/parseCokieHeader';

import { loginSchema, type LoginActionState, type LoginFieldErrors } from '../schemas/loginSchema';

export const loginAction = async (
    state: LoginActionState,
    formData: FormData,
): Promise<LoginActionState> => {
    const zodResult = loginSchema.safeParse(Object.fromEntries(formData));

    if (!zodResult.success) {
        const { fieldErrors, formErrors } = z.flattenError(zodResult.error);

        return {
            error: '',
            redirectTo: '',
            fieldErrors: fieldErrors as LoginFieldErrors,
            formErrors,
        };
    }

    const { email, password } = zodResult.data;

    const result = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        body: JSON.stringify({ password, email }),
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

    const cookieStore = await cookies();

    const setCookieHeader = result.headers.getSetCookie();

    if (setCookieHeader) {
        const parsed = parseCookies(setCookieHeader);
        for (const cookie of parsed) {
            cookieStore.set(cookie.name, cookie.value, cookie.options);
        }
    }

    return {
        error: '',
        redirectTo: '/',
        fieldErrors: {},
        formErrors: [],
    };
};
