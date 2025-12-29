'use client';

import { useRef } from 'react';

import { useLogout } from '@/features/auth/model/hooks/useLogOut';
import { User } from '@/features/auth/model/types';
import { useUserStore } from '@/shared/store/userStore';
import { Header } from '@/widgets/header/Header';

type HeaderWrapperProps = {
    initialUser: User | null;
};

export const HeaderWrapper = ({ initialUser }: HeaderWrapperProps) => {
    const hydrated = useRef(false);

    if (!hydrated.current) {
        hydrated.current = true;
        useUserStore.getState().setUser(initialUser);
    }

    const user = useUserStore((s) => s.user);
    const isAuth = useUserStore((s) => s.isAuth);
    const { mutate: logout, isPending } = useLogout();

    const logOut = async () => {
        logout();
    };

    return <Header user={user} isAuth={isAuth} logout={logOut} loading={isPending} />;
};
