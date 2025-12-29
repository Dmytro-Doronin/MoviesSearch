import { create } from 'zustand';

export type NotificationVariant = 'success' | 'error';

export type Notification = {
    id: string;
    message: string;
    variant: NotificationVariant;
    duration: number;
};

type NotificationState = {
    notification: Notification | null;
    timeoutId: number | null;

    notify: (notification: Omit<Notification, 'id'>) => void;
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    clear: () => void;
};

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notification: null,
    timeoutId: null,

    clear: () => {
        const timer = get().timeoutId;
        if (timer) {
            window.clearTimeout(timer);
        }
        set({ notification: null, timeoutId: null });
    },

    notify: (notify) => {
        get().clear();

        const id = crypto.randomUUID();
        const duration = notify.duration ?? 4000;

        set({
            notification: {
                id,
                message: notify.message,
                variant: notify.variant,
                duration,
            },
        });

        const timeoutId = window.setTimeout(() => {
            set({ notification: null, timeoutId: null });
        }, duration);

        set({ timeoutId });
    },

    success: (message, duration = 4000) => {
        get().notify({ message, variant: 'success', duration });
    },

    error: (message, duration = 4000) => {
        get().notify({ message, variant: 'error', duration });
    },
}));
