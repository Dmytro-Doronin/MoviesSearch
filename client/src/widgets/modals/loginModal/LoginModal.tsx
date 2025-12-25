'use client';

import { useActionState, useEffect, useState } from 'react';
import { z } from 'zod';

import { loginAction } from '@/features/auth/actions/loginAction';
import {
    LoginActionState,
    LoginClientErrors,
    LoginInput,
    loginSchema,
} from '@/features/auth/schemas/loginSchema';
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
    const [state, formAction, isPending] = useActionState<LoginActionState, FormData>(loginAction, {
        error: '',
        redirectTo: '',
        fieldErrors: {},
        formErrors: [],
    });

    const { error, redirectTo, fieldErrors } = state;
    const [values, setValues] = useState<LoginInput>({ email: '', password: '' });
    const [touched, setTouched] = useState<Partial<Record<keyof LoginInput, boolean>>>({});
    const [clientErrors, setClientErrors] = useState<LoginClientErrors>({});

    useEffect(() => {
        if (redirectTo) {
            location.assign(redirectTo);
        }
    }, [redirectTo]);

    const validateField = (name: keyof LoginInput) => {
        const result = loginSchema.safeParse(values);
        if (result.success) {
            return setClientErrors((p) => ({ ...p, [name]: undefined }));
        }
        const { fieldErrors } = z.flattenError(result.error);
        setClientErrors((p) => ({ ...p, [name]: fieldErrors[name]?.[0] }));
    };

    const emailError = (touched.email && clientErrors.email) || fieldErrors.email?.[0];
    const passwordError = (touched.password && clientErrors.password) || fieldErrors.password?.[0];

    return (
        <FormCard
            onClose={onClose}
            title="Login in"
            className={`${styles.modalContent} ${className} ${enter ? styles.enter : ''}`}
        >
            <form action={formAction}>
                <div className={styles.inputGroup}>
                    <TextField
                        name="email"
                        type="text"
                        placeholder="Email"
                        onChange={(e) => setValues((p) => ({ ...p, email: e.target.value }))}
                        onBlur={() => {
                            setTouched((p) => ({ ...p, email: true }));
                            validateField('email');
                        }}
                        errorMessage={emailError}
                    />

                    <TextField
                        name="password"
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setValues((p) => ({ ...p, password: e.target.value }))}
                        onBlur={() => {
                            setTouched((p) => ({ ...p, password: true }));
                            validateField('password');
                        }}
                        errorMessage={passwordError}
                    />
                </div>
                <Button variant="formTransparent" disabled={isPending} fullWidth type="button">
                    <Typography variant="body1">Forgot password</Typography>
                </Button>
                <div className={styles.infoGroup}>
                    <Button disabled={isPending} type="submit">
                        <Typography variant="body1">Log in</Typography>
                    </Button>
                    <Button disabled={isPending} variant="secondary" type="button">
                        <Typography variant="body1">Sign up</Typography>
                    </Button>
                </div>
                {error && <div>{error}</div>}
                {isPending && <Loader />}
            </form>
        </FormCard>
    );
};
