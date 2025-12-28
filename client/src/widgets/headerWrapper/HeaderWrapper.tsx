'use client';

import { useTransition } from 'react';

import { handleLogOut } from '@/features/auth/model/logOut';
import { useUserStore } from '@/shared/store/userStore';
import { Header } from '@/widgets/header/Header';

export const HeaderWrapper = () => {
    const user = useUserStore((s) => s.user);
    const logout = useUserStore((s) => s.logout);
    const isAuth = useUserStore((s) => s.isAuth);

    const [isPending, startTransition] = useTransition();

    const logOut = async () => {
        startTransition(handleLogOut);
        logout();
    };

    return <Header user={user} isAuth={isAuth} logout={logOut} loading={isPending} />;
};
