import { create } from 'zustand';

export type User = {
    id: string;
    email: string;
    login: string;
    imageUrl: string | null;
};

type AuthState = {
    user: User | null;
    isAuth: boolean;

    setUser: (user: User | null) => void;
    logout: () => void;
};

export const useUserStore = create<AuthState>((set) => ({
    user: null,
    isAuth: false,

    setUser: (user) => set({ user, isAuth: !!user }),
    logout: () => set({ user: null, isAuth: false }),
}));
