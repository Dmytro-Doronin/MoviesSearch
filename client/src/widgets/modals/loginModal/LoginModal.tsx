'use client';

import { useActionState, useEffect } from 'react';

import { loginAction, LoginActionState } from '@/features/auth/actions/loginAction';
import { useEnter } from '@/hooks/useEnter';
import { Button } from '@/shared/ui/button/Button';
import { Loader } from '@/shared/ui/loader/Loader';
import { TextField } from '@/shared/ui/textField/TextField';
import { Typography } from '@/shared/ui/typography/Typography';
import { FormCard } from '@/widgets/formCard/FormCard';

import styles from './loginModal.module.scss';

type LoginModal = {
    open?: boolean;
    onClose?: () => void;
    className?: string;
};
export const LoginModal = ({ onClose, className, open }: LoginModal) => {
    const enter = useEnter(open);
    const [{ error, redirectTo }, formAction, isPending] = useActionState<
        LoginActionState,
        FormData
    >(loginAction, {
        error: '',
        redirectTo: '',
    });

    useEffect(() => {
        if (redirectTo) {
            location.assign(redirectTo);
        }
    });

    return (
        <FormCard
            onClose={onClose}
            title="Login in"
            className={`${styles.modalContent} ${className} ${enter ? styles.enter : ''}`}
        >
            <form action={formAction}>
                <div className={styles.inputGroup}>
                    <TextField name="email" type="text" placeholder="Email" />
                    <TextField name="password" type="password" placeholder="Password" />
                </div>
                <Button variant="formTransparent" disabled={isPending} fullWidth type="submit">
                    <Typography variant="body1">Forgot password</Typography>
                </Button>
                <div className={styles.infoGroup}>
                    <Button disabled={isPending} type="submit">
                        <Typography variant="body1">Log in</Typography>
                    </Button>
                    <Button disabled={isPending} variant="secondary">
                        <Typography variant="body1">Sign up</Typography>
                    </Button>
                </div>
                {error && <div>{error}</div>}
                {isPending && <Loader />}
            </form>
        </FormCard>
    );
};
