'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { authApi } from '@/shared/api/auth/authApi';
import { getApiErrorMessage } from '@/shared/api/error';
import { useNotificationStore } from '@/shared/store/notificationStore';
import { useUserStore } from '@/shared/store/userStore';

export function useLogout() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const logoutLocal = useUserStore((s) => s.logout);
    const success = useNotificationStore((s) => s.success);
    const error = useNotificationStore((s) => s.error);
    return useMutation({
        mutationFn: authApi.logout,

        onSuccess: async () => {
            logoutLocal();
            success('Logged out');
            await queryClient.cancelQueries();
            queryClient.clear();
            router.push('/');
            router.refresh();
        },

        onError: (err) => {
            error(getApiErrorMessage(err));
        },
    });
}
