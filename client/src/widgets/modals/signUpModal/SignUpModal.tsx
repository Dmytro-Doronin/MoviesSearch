'use client';

import { FocusEventHandler, useActionState, useEffect, useState } from 'react';
import { z } from 'zod';

import { signUpAction } from '@/features/auth/actions/signUpAction';
import {
    SignUpActionState,
    SignUpClientErrors,
    SignUpInput,
    signUpSchema,
} from '@/features/auth/schemas/signUpSchema';
import { useEnter } from '@/hooks/useEnter';
import { useModalStore } from '@/shared/store/modalStore';
import { Button } from '@/shared/ui/button/Button';
import { Loader } from '@/shared/ui/loader/Loader';
import { TextField } from '@/shared/ui/textField/TextField';
import { Typography } from '@/shared/ui/typography/Typography';
import { FormCard } from '@/widgets/formCard/FormCard';

import styles from './signUpModal.module.scss';

type SignUpModal = {
    open?: boolean;
    onClose?: () => void;
    className?: string;
};
export const SignUpModal = ({ onClose, className, open }: SignUpModal) => {
    const enter = useEnter(open);

    const [state, formAction, isPending] = useActionState<SignUpActionState, FormData>(
        signUpAction,
        {
            error: '',
            redirectTo: '',
            fieldErrors: {},
            formErrors: [],
        },
    );

    const openModal = useModalStore((s) => s.open);

    const { error, redirectTo, fieldErrors } = state;
    const [values, setValues] = useState<SignUpInput>({ email: '', password: '', login: '' });
    const [touched, setTouched] = useState<Partial<Record<keyof SignUpInput, boolean>>>({});
    const [clientErrors, setClientErrors] = useState<SignUpClientErrors>({});

    useEffect(() => {
        if (redirectTo) {
            location.assign(redirectTo);
        }
    }, [redirectTo]);

    const validateField = (name: keyof SignUpInput) => {
        const result = signUpSchema.safeParse(values);
        if (result.success) {
            return setClientErrors((p) => ({ ...p, [name]: undefined }));
        }
        const { fieldErrors } = z.flattenError(result.error);
        setClientErrors((p) => ({ ...p, [name]: fieldErrors[name]?.[0] }));
    };

    const onBlur =
        (field: keyof SignUpInput): FocusEventHandler<HTMLInputElement> =>
        () => {
            setTouched((p) => ({ ...p, [field]: true }));
            validateField(field);
        };

    const emailError = (touched.email && clientErrors.email) || fieldErrors.email?.[0];
    const loginError = (touched.login && clientErrors.login) || fieldErrors.login?.[0];
    const passwordError = (touched.password && clientErrors.password) || fieldErrors.password?.[0];

    const openLoginModal = () => {
        onClose?.();
        openModal('login');
    };

    return (
        <FormCard
            onClose={onClose}
            title="Sign Up"
            className={`${styles.modalContent} ${className} ${enter ? styles.enter : ''}`}
        >
            <form action={formAction}>
                <div className={styles.inputGroup}>
                    <TextField
                        name="login"
                        type="text"
                        placeholder="Login"
                        onChange={(e) => setValues((p) => ({ ...p, login: e.target.value }))}
                        onBlur={onBlur('login')}
                        errorMessage={loginError}
                    />

                    <TextField
                        name="email"
                        type="text"
                        placeholder="Email"
                        onChange={(e) => setValues((p) => ({ ...p, email: e.target.value }))}
                        onBlur={onBlur('email')}
                        errorMessage={emailError}
                    />

                    <TextField
                        name="password"
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setValues((p) => ({ ...p, password: e.target.value }))}
                        onBlur={onBlur('password')}
                        errorMessage={passwordError}
                    />
                </div>
                <div className={styles.infoGroup}>
                    <Button disabled={isPending} type="submit">
                        <Typography variant="body1">SignUp</Typography>
                    </Button>
                    <Button
                        onClick={openLoginModal}
                        disabled={isPending}
                        variant="secondary"
                        type="button"
                    >
                        <Typography variant="body1">Try to Log in</Typography>
                    </Button>
                </div>
                {error && <div>{error}</div>}
                {isPending && <Loader />}
            </form>
        </FormCard>
    );
};
