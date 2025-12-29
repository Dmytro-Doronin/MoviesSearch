'use client';

import { useLogout } from '@/features/auth/model/hooks/useLogOut';
import { useUserStore } from '@/shared/store/userStore';
import { Header } from '@/widgets/header/Header';

export const HeaderWrapper = () => {
    const user = useUserStore((s) => s.user);
    const isAuth = useUserStore((s) => s.isAuth);
    const { mutate: logout, isPending } = useLogout();

    const logOut = async () => {
        logout();
    };

    return <Header user={user} isAuth={isAuth} logout={logOut} loading={isPending} />;
};
