import { cookies } from 'next/headers';

import { User } from '@/features/auth/model/types';

export const getMe = async () => {
    const cookiesStore = await cookies();
    const accessToken = cookiesStore.get('accessToken')?.value;

    const result = await fetch('http://localhost:3000/auth/me', {
        credentials: 'include',
        cache: 'no-store',
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });

    if (result.status === 401) {
        return { isError: false, data: undefined };
    }

    if (!result.ok) {
        return { isError: true, data: undefined };
    }
    const data: { user: User } = await result.json();
    return { isError: false, data: data.user };
};
