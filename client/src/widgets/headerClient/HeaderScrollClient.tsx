'use client';

import { useEffect } from 'react';

import styles from './header.module.scss';

export const HeaderScrollClient = () => {
    useEffect(() => {
        const primary = document.getElementById('headerPrimary');
        const secondary = document.getElementById('headerSecondary');

        if (!primary || !secondary) {
            return;
        }

        const showAt = 88;
        const hideAt = 40;
        let ticking = false;

        const apply = (y: number) => {
            const scrolled = y > showAt;

            primary.classList.toggle(styles.hidden, scrolled);

            secondary.classList.toggle(styles.visible, scrolled);

            if (!scrolled && y <= hideAt) {
                primary.classList.remove(styles.hidden);
                secondary.classList.remove(styles.visible);
            }
        };

        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                apply(window.scrollY);
                ticking = false;
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        apply(window.scrollY);

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return null;
};
