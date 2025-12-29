import { NextRequest, NextResponse } from 'next/server';

import { forwardSetCookies, safeJson } from '@/utils/apiUtils';

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
