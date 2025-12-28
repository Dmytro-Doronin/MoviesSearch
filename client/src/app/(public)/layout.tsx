import { ReactNode } from 'react';

import { PublicLayoutClient } from '@/app/(public)/PublicLayoutClient';
import { getMe } from '@/features/auth/model/authApi';

import styles from './layout.module.scss';

const PublicLayout = async ({ children }: { children: ReactNode }) => {
    const { data } = await getMe();
    return (
        <div className={styles.authLayout}>
            <PublicLayoutClient user={data ?? null} />
            {children}
        </div>
    );
};

export default PublicLayout;
