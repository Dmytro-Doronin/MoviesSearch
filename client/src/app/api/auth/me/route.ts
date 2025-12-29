import { NextRequest, NextResponse } from 'next/server';

const NEST_API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export async function GET(req: NextRequest) {
    const nestRes = await fetch(`${NEST_API}/auth/me`, {
        method: 'GET',
        headers: {
            cookie: req.headers.get('cookie') ?? '',
            authorization: req.headers.get('authorization') ?? '',
        },
        cache: 'no-store',
    });

    const body = await safeJson(nestRes);

    const res = NextResponse.json(body, { status: nestRes.status });

    forwardSetCookies(nestRes, res);

    return res;
}

async function safeJson(r: Response) {
    try {
        return await r.json();
    } catch {
        return null;
    }
}

function forwardSetCookies(from: Response, to: NextResponse) {
    const anyHeaders = from.headers as unknown as { getSetCookie?: () => string[] };
    const setCookies = anyHeaders.getSetCookie?.() ?? [];

    for (const c of setCookies) {
        to.headers.append('set-cookie', c);
    }

    const sc = from.headers.get('set-cookie');
    if (sc) {
        to.headers.append('set-cookie', sc);
    }
}
