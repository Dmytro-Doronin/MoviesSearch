import { NextResponse } from 'next/server';

export const safeJson = async (r: Response) => {
    try {
        return await r.json();
    } catch {
        return null;
    }
};

function splitSetCookie(headerValue: string | null): string[] {
    if (!headerValue) return [];

    const parts: string[] = [];
    let start = 0;
    let inExpires = false;

    for (let i = 0; i < headerValue.length; i++) {
        const ch = headerValue[i];

        if (!inExpires && headerValue.slice(i, i + 8).toLowerCase() === 'expires=') {
            inExpires = true;
            i += 7;
            continue;
        }

        if (inExpires && ch === ';') {
            inExpires = false;
            continue;
        }

        if (!inExpires && ch === ',') {
            const piece = headerValue.slice(start, i).trim();
            if (piece) parts.push(piece);
            start = i + 1;
        }
    }

    const last = headerValue.slice(start).trim();
    if (last) parts.push(last);
    return parts;
}

export const forwardSetCookies = (from: Response, to: NextResponse) => {
    const anyHeaders = from.headers as unknown as { getSetCookie?: () => string[] };
    const setCookies = anyHeaders.getSetCookie?.();

    if (setCookies?.length) {
        for (const c of setCookies) to.headers.append('set-cookie', c);
        return;
    }

    const sc = from.headers.get('set-cookie');
    for (const c of splitSetCookie(sc)) {
        to.headers.append('set-cookie', c);
    }
};
export function getSetCookieLines(res: Response): string[] {
    const anyHeaders = res.headers as unknown as { getSetCookie?: () => string[] };
    const arr = anyHeaders.getSetCookie?.();
    if (arr?.length) return arr;

    const sc = res.headers.get('set-cookie');
    return splitSetCookie(sc);
}

export function getCookieValueFromSetCookieLines(lines: string[], name: string) {
    for (const line of lines) {
        const first = line.split(';', 1)[0]; // "accessToken=...."
        if (first.startsWith(`${name}=`)) return first.slice(name.length + 1);
    }
    return undefined;
}
