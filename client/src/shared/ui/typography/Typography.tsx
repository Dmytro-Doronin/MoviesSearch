'use client';

import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

import styles from './typography.module.scss';

type VariantType = 'h1' | 'body2' | 'h2' | 'body1' | 'h4';

export type TypographyPropsType<T extends ElementType = 'p'> = {
    as?: T;
    children: ReactNode;
    variant: VariantType;
    className?: string;
} & ComponentPropsWithoutRef<T>;

export const Typography = <T extends ElementType = 'p'>(props: TypographyPropsType<T>) => {
    const { as: Component = 'p', variant = 'body1', className, children, ...rest } = props;

    return (
        <Component className={`${styles.text} ${styles[variant]} ${className}`} {...rest}>
            {children}
        </Component>
    );
};
