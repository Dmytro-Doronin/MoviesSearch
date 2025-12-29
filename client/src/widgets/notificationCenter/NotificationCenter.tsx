'use client';

import { useNotificationStore } from '@/shared/store/notificationStore';
import { Button } from '@/shared/ui/button/Button';

import styles from './notificationCenter.module.scss';

export const NotificationCenter = () => {
    const notification = useNotificationStore((s) => s.notification);
    const clear = useNotificationStore((s) => s.clear);

    if (!notification) {
        return null;
    }

    return (
        <Button variant="transparent" onClick={clear}>
            <div className={styles.notificationWrapper}>
                <div
                    key={notification.id}
                    className={`${styles.toastBox} ${styles[notification.variant]}`}
                >
                    {notification.message}
                </div>
            </div>
        </Button>
    );
};
