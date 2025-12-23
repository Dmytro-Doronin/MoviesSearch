'use server';

import { cookies } from 'next/headers';

import { parseCookies } from '@/helpers/parseCokieHeader';
export type LoginActionState = {
    error: string;
    redirectTo: string;
};
export const loginAction = async (
    state: LoginActionState,
    formData: FormData,
): Promise<LoginActionState> => {
    const email = formData.get('email')?.toString() || '';
    const password = formData.get('password')?.toString() || '';

    const result = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        body: JSON.stringify({ password, email }),
        headers: { 'Content-Type': 'application/json' },
    });

    if (result.status !== 200) {
        return { error: 'Invalid login or password', redirectTo: '' };
    }

    const cookieStore = await cookies();

    const setCookieHeader = result.headers.getSetCookie();

    if (setCookieHeader) {
        const parsed = parseCookies(setCookieHeader);
        for (const cookie of parsed) {
            cookieStore.set(cookie.name, cookie.value, cookie.options);
        }
    }

    return { error: '', redirectTo: '/' };
};
