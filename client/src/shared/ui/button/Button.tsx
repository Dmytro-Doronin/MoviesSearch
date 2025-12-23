import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

import styles from './button.module.scss';

export type ButtonProps<T extends ElementType = 'button'> = {
    as?: T;
    children: ReactNode;
    variant?:
        | 'primary'
        | 'secondary'
        | 'pagination'
        | 'gradient'
        | 'link'
        | 'linkAside'
        | 'transparent'
        | 'formTransparent'
        | 'special';
    fullWidth?: boolean;
    className?: string;
} & ComponentPropsWithoutRef<T>;

export const Button = <T extends ElementType = 'button'>(props: ButtonProps<T>) => {
    const { variant = 'primary', fullWidth, className, as: Component = 'button', ...rest } = props;

    return (
        <Component
            className={`${styles.button} ${styles[variant]} ${fullWidth ? styles.fullWidth : ''} ${className}`}
            {...rest}
        ></Component>
    );
};
