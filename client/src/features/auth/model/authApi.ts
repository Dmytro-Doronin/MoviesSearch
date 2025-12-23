import { cookies } from 'next/headers';

import { User } from '@/features/auth/model/types';

export const getUsers = async () => {
    const cookiesStore = await cookies();

    const result = await fetch('http://localhost:3000/auth/me', {
        credentials: 'include',
        headers: {
            Cookie: cookiesStore.toString(),
        },
    });

    if (result.status === 401) {
        return { isError: false, data: undefined };
    }

    if (!result.ok) {
        return { isError: true, data: undefined };
    }

    const data: { user: User } = await result.json();

    return { isError: true, data: data.user };
};
