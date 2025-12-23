'use client';

import { Header } from '@/widgets/header/Header';

export const HeaderWrapper = () => {
    const logout = async () => {
        console.log('Logout');
    };

    return <Header user={null} isAuth={false} logout={logout} />;
};
