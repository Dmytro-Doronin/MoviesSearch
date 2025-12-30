'use client';

import type { User } from '@/features/auth/model/types';

import { useLogout } from '@/features/auth/model/hooks/useLogOut';
import { useModalStore } from '@/shared/store/modalStore';
import { Button } from '@/shared/ui/button/Button';

export function HeaderActionsClient({ isAuth }: { isAuth: boolean; user: User | null }) {
    const open = useModalStore((s) => s.open);
    const { mutate: logout, isPending } = useLogout();

    if (isAuth) {
        return (
            <Button onClick={() => logout()} disabled={isPending}>
                {isPending ? '...' : 'Log out'}
            </Button>
        );
    }

    return (
        <>
            <Button onClick={() => open('login')}>Sign In</Button>
            <Button onClick={() => open('signup')} variant="secondary">
                Sign Up
            </Button>
        </>
    );
}
