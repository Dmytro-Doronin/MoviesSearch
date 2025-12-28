'use client';

import { useUserStore } from '@/shared/store/userStore';
import { Header } from '@/widgets/header/Header';

export const HeaderWrapper = () => {
    const user = useUserStore((s) => s.user);
    const logout = useUserStore((s) => s.logout);
    const isAuth = useUserStore((s) => s.isAuth);

    const logOut = async () => {
        logout();
    };

    return <Header user={user} isAuth={isAuth} logout={logOut} />;
};
