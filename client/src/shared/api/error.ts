import axios from 'axios';

type ApiErrorBody = {
    message?: string | string[];
    error?: string;
    statusCode?: number;
};

export function getApiErrorMessage(err: unknown): string {
    if (!axios.isAxiosError(err)) {
        return 'Unexpected error';
    }

    const data = err.response?.data as ApiErrorBody | undefined;

    if (data?.message) {
        if (Array.isArray(data.message)) {
            return data.message.join(', ');
        }
        return String(data.message);
    }

    if (data?.error) {
        return String(data.error);
    }

    const status = err.response?.status;
    if (status) {
        return `Request failed (${status})`;
    }

    return err.message || 'Request failed';
}
