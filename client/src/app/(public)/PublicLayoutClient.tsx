'use client';

import { useEffect } from 'react';

import { User, useUserStore } from '@/shared/store/userStore';

type PublicLayoutClient = {
    user: User | null;
};

export const PublicLayoutClient = ({ user }: PublicLayoutClient) => {
    const setUser = useUserStore((s) => s.setUser);

    useEffect(() => {
        setUser(user);
    }, [setUser, user]);

    return null;
};
