import styles from './loader.module.scss';

type loader = {
    variant?: 'light' | 'dark';
};

export const Loader = ({ variant = 'dark' }: loader) => {
    return (
        <div className={styles.loaderWrapper}>
            <div className={`${styles.loader} ${styles[variant]}`}></div>
        </div>
    );
};
