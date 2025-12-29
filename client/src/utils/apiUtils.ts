import { NextResponse } from 'next/server';

export const safeJson = async (r: Response) => {
    try {
        return await r.json();
    } catch {
        return null;
    }
};

export const forwardSetCookies = (from: Response, to: NextResponse) => {
    const anyHeaders = from.headers as unknown as { getSetCookie?: () => string[] };
    const setCookies = anyHeaders.getSetCookie?.() ?? [];

    for (const c of setCookies) {
        to.headers.append('set-cookie', c);
    }

    const sc = from.headers.get('set-cookie');
    if (sc) {
        to.headers.append('set-cookie', sc);
    }
};
