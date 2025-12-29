import { http } from '@/shared/api/http';

export const authApi = {
    logout: async (): Promise<void> => {
        await http.post('/auth/logout');
    },
};
