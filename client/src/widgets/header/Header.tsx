'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import NoAvatar from '@/assets/no-avatar.jpeg';
import { UserType } from '@/features/auth/model/types';
import { pathVariables } from '@/shared/config/paths/pathVariables';
import { useModalStore } from '@/shared/store/modalStore';
import { Button } from '@/shared/ui/button/Button';
import Sun from '@/shared/ui/icons/Sun';
import User from '@/shared/ui/icons/User';
import { CardImage } from '@/shared/ui/image/Image';
import { Logo } from '@/shared/ui/logo/Logo';

import styles from './header.module.scss';

type HeaderProps = {
    isAuth: boolean;
    user: UserType | null;
    logout: () => Promise<void>;
};

export const Header = ({ isAuth, user, logout }: HeaderProps) => {
    const [scrolled, setScrolled] = useState(false);
    const open = useModalStore((s) => s.open);

    const openLoginModal = () => {
        open('login');
    };

    useEffect(() => {
        const showAt = 88;
        const hideAt = 40;
        let ticking = false;

        const onScroll = () => {
            if (ticking) {
                return;
            }
            ticking = true;
            requestAnimationFrame(() => {
                const y = window.scrollY;
                setScrolled((prev) => (prev ? y > hideAt : y > showAt));
                ticking = false;
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <>
            <header className={`${styles.headerPrimary} ${scrolled ? styles.hidden : ''}`}>
                <div className="container">
                    <div className={styles.innerPrimary}>
                        <Logo />
                        {isAuth ? (
                            <div className={styles.userBlock}>
                                <CardImage
                                    src={user?.imageUrl ? user.imageUrl : NoAvatar}
                                    variant="tiny"
                                ></CardImage>
                                <span>{user?.login}</span>
                                <Button variant="secondary" as={Link} href={pathVariables.ADMIN}>
                                    Admin
                                </Button>
                                <Button onClick={logout}>Log out</Button>
                            </div>
                        ) : (
                            <div className={styles.btnGroup}>
                                <Button onClick={openLoginModal}>Sign In</Button>
                                <Button as={Link} variant="secondary" href="/login">
                                    Sign Up
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <header className={`${styles.headerSecondary} ${scrolled ? styles.visible : ''}`}>
                <div className="container">
                    <div className={styles.innerSecondary}>
                        <Logo variant="small" />
                        <div className={styles.btnGroup}>
                            <Button variant="special">
                                <Sun className={styles.icons} />
                            </Button>
                            <Button variant="special">
                                <User />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};
