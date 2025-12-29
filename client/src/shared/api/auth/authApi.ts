import { http } from '@/shared/api/http';

export const authApi = {
    logout: async (): Promise<void> => {
        await http.delete('/auth/logout');
    },
};
