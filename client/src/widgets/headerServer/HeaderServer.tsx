'use server';

import NoAvatar from '@/assets/no-avatar.jpeg';
import { getMe } from '@/features/auth/model/authApi';
import { Button } from '@/shared/ui/button/Button';
import Sun from '@/shared/ui/icons/Sun';
import UserIcon from '@/shared/ui/icons/User';
import { CardImage } from '@/shared/ui/image/Image';
import { Logo } from '@/shared/ui/logo/Logo';
import { HeaderActionsClient } from '@/widgets/headerServer/HeaderActionsClient';

import styles from './header.module.scss';
import { HeaderScrollClient } from './HeaderScrollClient';

export const HeaderServer = async () => {
    const { data: user } = await getMe();
    const isAuth = !!user;

    return (
        <>
            <header id="headerPrimary" className={styles.headerPrimary}>
                <div className="container">
                    <div className={styles.innerPrimary}>
                        <Logo />

                        {isAuth ? (
                            <div className={styles.userBlock}>
                                <CardImage src={user?.imageUrl ?? NoAvatar} variant="tiny" />
                                <span>{user?.login}</span>

                                {/*<Link*/}
                                {/*    href={pathVariables.ADMIN}*/}
                                {/*    className={`${styles.adminLink} ${styles.secondaryBtn}`}*/}
                                {/*>*/}
                                {/*    Admin*/}
                                {/*</Link>*/}

                                <HeaderActionsClient isAuth user={user} />
                            </div>
                        ) : (
                            <div className={styles.btnGroup}>
                                <HeaderActionsClient isAuth={false} user={null} />
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <header id="headerSecondary" className={styles.headerSecondary}>
                <div className="container">
                    <div className={styles.innerSecondary}>
                        <Logo variant="small" />
                        <div className={styles.btnGroup}>
                            <Button variant="special">
                                <Sun className={styles.icons} />
                            </Button>
                            <Button variant="special">
                                <UserIcon />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <HeaderScrollClient />
        </>
    );
};
