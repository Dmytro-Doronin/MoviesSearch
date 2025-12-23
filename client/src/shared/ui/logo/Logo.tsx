import Link from 'next/link';

import styles from './Logo.module.scss';

type Logo = {
    variant?: 'large' | 'small';
};

export const Logo = ({ variant = 'large' }: Logo) => {
    return (
        <>
            {variant === 'large' ? (
                <Link href="/">
                    <span className={styles.logo}>M-Search</span>
                </Link>
            ) : (
                <Link href="/">
                    <div className={styles.smallLogo}>
                        <span className={styles.smallLogoLabel}>M</span>
                    </div>
                </Link>
            )}
        </>
    );
};
