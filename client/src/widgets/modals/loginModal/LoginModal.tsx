'use client';

import { useEnter } from '@/hooks/useEnter';
import { FormCard } from '@/widgets/formCard/FormCard';

import styles from './loginModal.module.scss';

type LoginModal = {
    open?: boolean;
    onClose?: () => void;
    className?: string;
};

export const LoginModal = ({ onClose, className, open }: LoginModal) => {
    const enter = useEnter(open);

    return (
        <FormCard
            onClose={onClose}
            title="Login in"
            className={`${styles.modalContent} ${className} ${enter ? styles.enter : ''}`}
        >
            <div>Form</div>
        </FormCard>
    );
};
