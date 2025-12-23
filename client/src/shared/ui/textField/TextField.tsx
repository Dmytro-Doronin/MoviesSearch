'use client';

import {
    ComponentPropsWithoutRef,
    forwardRef,
    ForwardRefExoticComponent,
    MemoExoticComponent,
    RefAttributes,
    SVGProps,
    useState,
} from 'react';
import * as React from 'react';

import { Typography } from '@/shared/ui/typography/Typography';

import styles from './textField.module.scss';

export type TextFieldProps = {
    onValueChange?: (value: string) => void;
    containerProps?: string;
    errorMessage?: string;
    label?: string;
    iconClassName?: string;
    Icon?: MemoExoticComponent<
        ForwardRefExoticComponent<
            Omit<SVGProps<SVGSVGElement>, 'ref'> & RefAttributes<SVGSVGElement>
        >
    >;
} & ComponentPropsWithoutRef<'input'>;

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
    (
        {
            className,
            errorMessage,
            Icon,
            placeholder,
            type,
            containerProps,
            label,
            onChange,
            onValueChange,
            iconClassName,
            ...restProps
        },
        ref,
    ) => {
        const [containerFocused, setContainerFocused] = useState(false);
        const inputRef = React.useRef<HTMLInputElement>(null);
        React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);
        const containerTypeStyle = containerFocused
            ? `${styles.fieldContainer} ${styles.containerFocused}`
            : styles.fieldContainer;
        const field = !!errorMessage && styles.error;

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange?.(e);
            onValueChange?.(e.target.value);
        };

        const focusedHandler = () => {
            setContainerFocused(true);
        };

        const unFocusedHandler = () => {
            setContainerFocused(false);
        };

        return (
            <>
                <label
                    className={`${styles.root} ${containerProps}`}
                    // onClick={() => inputRef.current?.focus()}
                >
                    <div
                        onFocus={focusedHandler}
                        onBlur={unFocusedHandler}
                        className={containerTypeStyle}
                    >
                        <div className={styles.inputContainer}>
                            {label && (
                                <Typography variant="body2" as="label" className={styles.label}>
                                    {label}
                                </Typography>
                            )}
                            <input
                                ref={inputRef}
                                className={`${field} ${styles.field} ${className}`}
                                placeholder={placeholder}
                                type={type}
                                onChange={handleChange}
                                autoComplete={type === 'password' ? 'off' : undefined}
                                {...restProps}
                            />
                        </div>
                        {Icon && <Icon className={`${styles.icon} ${iconClassName}`} />}
                    </div>
                </label>
                <span className={errorMessage ? 'error' : ''}>{errorMessage}</span>
            </>
        );
    },
);

TextField.displayName = 'TextField';
