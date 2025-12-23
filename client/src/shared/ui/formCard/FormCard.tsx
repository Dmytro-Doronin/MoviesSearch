import { ReactNode } from 'react';

import { Button } from '@/shared/ui/button/Button';
import { Typography } from '@/shared/ui/typography/Typography';

import styles from './formCard.module.scss';

type FormCard = {
    onClose?: () => void;
    children?: ReactNode;
    title?: string;
    className?: string;
};

export const FormCard = ({ children, title, onClose, className }: FormCard) => {
    return (
        <div className={`${styles.formCard} ${className}`}>
            <div className={styles.header}>
                <Typography variant="h4" className={styles.title}>
                    {title}
                </Typography>
                <Button variant="transparent" className={styles.close} onClick={onClose}>
                    X
                </Button>
            </div>
            {children}
        </div>
    );
};
