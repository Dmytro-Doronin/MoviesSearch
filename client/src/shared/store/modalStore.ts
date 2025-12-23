// import { create } from 'zustand'
//
// export type ModalName = null | 'login' | 'signup' | 'chat' | 'trailer'
//
// type ModalState = {
//     current: ModalName
//     payload: string | null
//     open: (name: Exclude<ModalName, null>, payload?: string) => void
//     close: () => void
// }
//
// export const useModalStore = create<ModalState>((set) => ({
//     current: null,
//     payload: null,
//
//     open: (name, payload) => set({ current: name, payload: payload ?? null }),
//     close: () => set({ current: null, payload: null }),
// }))

import { create } from 'zustand';

import { lockScroll, unlockScroll } from '@/utils/modalScroll';

export type ModalName = null | 'login' | 'signup' | 'chat' | 'trailer';

type ModalState = {
    activeModal: ModalName;
    opened: boolean;
    payload: string | null;

    open: (name: Exclude<ModalName, null>, payload?: string) => void;
    close: () => void;
    finishClose: () => void;
};

export const useModalStore = create<ModalState>((set) => ({
    activeModal: null,
    opened: false,
    payload: null,

    open: (name, payload) => {
        lockScroll();
        set({ activeModal: name, payload: payload ?? null, opened: false });
        requestAnimationFrame(() => set({ opened: true }));
    },

    close: () => {
        set({ opened: false });
    },

    finishClose: () => {
        unlockScroll();
        set({ activeModal: null, payload: null });
    },
}));
