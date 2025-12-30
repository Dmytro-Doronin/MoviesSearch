import { ReactNode } from 'react';

import { PublicLayoutClient } from '@/app/(public)/PublicLayoutClient';

import styles from './layout.module.scss';

const PublicLayout = async ({ children }: { children: ReactNode }) => {
    return (
        <div className={styles.authLayout}>
            <PublicLayoutClient user={null} />
            {children}
        </div>
    );
};

export default PublicLayout;
