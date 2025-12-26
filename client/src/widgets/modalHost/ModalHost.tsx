'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';

import { useModalStore } from '@/shared/store/modalStore';
import { LoginModal } from '@/widgets/modals/loginModal/LoginModal';
import { SignUpModal } from '@/widgets/modals/signUpModal/SignUpModal';

import styles from './hostModal.module.scss';

export const ModalHost = () => {
    const { activeModal, opened, close, finishClose } = useModalStore();

    if (typeof document === 'undefined') {
        return null;
    }

    const onTransitionEnd: React.TransitionEventHandler<HTMLDivElement> = (e) => {
        if (e.target !== e.currentTarget) {
            return;
        }
        if (!opened && activeModal) {
            finishClose();
        }
    };

    if (!activeModal) {
        return null;
    }

    return createPortal(
        <div
            className={`${styles.modalOverlay} ${opened ? styles.open : styles.closed}`}
            onTransitionEnd={onTransitionEnd}
        >
            <div className={styles.contentWrap} key={activeModal}>
                {activeModal === 'login' && <LoginModal open={opened} onClose={close} />}
                {activeModal === 'signup' && <SignUpModal open={opened} onClose={close} />}
            </div>
        </div>,
        document.body,
    );
};
