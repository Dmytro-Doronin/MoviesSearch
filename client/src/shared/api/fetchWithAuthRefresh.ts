import type { NextRequest } from 'next/server';

import { getCookieValueFromSetCookieLines, getSetCookieLines } from '@/utils/apiUtils';

const NEST_API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

function upsertCookie(cookieHeader: string, name: string, value: string) {
    const parts = cookieHeader
        .split(';')
        .map((s) => s.trim())
        .filter(Boolean)
        .filter((p) => !p.startsWith(`${name}=`));

    parts.push(`${name}=${value}`);
    return parts.join('; ');
}

export type NestCallResult = {
    nestRes: Response;
    setCookiesToForward: string[];
};

type RefreshResult = { ok: boolean; setCookies: string[] };
let refreshInFlight: Promise<RefreshResult> | null = null;

async function runSingleRefresh(cookie: string): Promise<RefreshResult> {
    if (!refreshInFlight) {
        refreshInFlight = (async () => {
            const r = await fetch(`${NEST_API}/auth/refresh-token`, {
                method: 'POST',
                headers: { Cookie: cookie },
                cache: 'no-store',
            });

            if (!r.ok) return { ok: false, setCookies: [] };

            const setCookies = getSetCookieLines(r);
            return { ok: true, setCookies };
        })().finally(() => {
            refreshInFlight = null;
        });
    }

    return refreshInFlight;
}

export async function fetchNestWithRefresh(
    req: NextRequest,
    nestPath: string,
    init?: RequestInit,
): Promise<NestCallResult> {
    const cookie = req.headers.get('cookie') ?? '';

    const baseHeaders = new Headers(init?.headers ?? {});
    baseHeaders.set('Cookie', cookie);

    let nestRes = await fetch(`${NEST_API}${nestPath}`, {
        ...init,
        headers: baseHeaders,
        cache: 'no-store',
    });

    if (nestRes.status !== 401) {
        return { nestRes, setCookiesToForward: [] };
    }

    const refreshRes = await runSingleRefresh(cookie);
    if (!refreshRes.ok) {
        return { nestRes, setCookiesToForward: [] };
    }

    const refreshSetCookies = refreshRes.setCookies;

    const newAccess = getCookieValueFromSetCookieLines(refreshSetCookies, 'accessToken');
    const newRefresh = getCookieValueFromSetCookieLines(refreshSetCookies, 'refreshToken');

    let patchedCookie = cookie;
    if (newAccess) patchedCookie = upsertCookie(patchedCookie, 'accessToken', newAccess);
    if (newRefresh) patchedCookie = upsertCookie(patchedCookie, 'refreshToken', newRefresh);

    const retryHeaders = new Headers(init?.headers ?? {});
    retryHeaders.set('Cookie', patchedCookie);

    nestRes = await fetch(`${NEST_API}${nestPath}`, {
        ...init,
        headers: retryHeaders,
        cache: 'no-store',
    });

    return { nestRes, setCookiesToForward: refreshSetCookies };
}
