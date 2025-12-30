import { NextRequest, NextResponse } from 'next/server';

import { forwardSetCookies, safeJson } from '@/utils/apiUtils';

const NEST_API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    const nestRes = await fetch(`${NEST_API}/auth/refresh-token`, {
        method: 'POST',
        headers: {
            cookie: req.headers.get('cookie') ?? '',
        },
        cache: 'no-store',
    });

    const body = await safeJson(nestRes);

    const res = NextResponse.json(body, { status: nestRes.status });
    forwardSetCookies(nestRes, res);
    return res;
}
