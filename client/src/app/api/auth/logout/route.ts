import { NextRequest, NextResponse } from 'next/server';

import { forwardSetCookies } from '@/utils/apiUtils';

const NEST_API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export async function POST(req: NextRequest) {
    const nestRes = await fetch(`${NEST_API}/auth/logout`, {
        method: 'DELETE',
        headers: {
            cookie: req.headers.get('cookie') ?? '',
            'content-type': 'application/json',
        },
        cache: 'no-store',
    });

    const res = new NextResponse(null, { status: nestRes.status });
    forwardSetCookies(nestRes, res);
    return res;
}
