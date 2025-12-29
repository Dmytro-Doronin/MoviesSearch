import { NextRequest, NextResponse } from 'next/server';

import { forwardSetCookies } from '@/utils/apiUtils';

const NEST = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3000';

export const config = {
    matcher: ['/((?!api|_next|favicon.ico).*)'],
};

export async function middleware(req: NextRequest) {
    const refreshToken = req.cookies.get('refreshToken')?.value;
    const accessToken = req.cookies.get('accessToken')?.value;

    if (!refreshToken) {
        return NextResponse.next();
    }

    if (accessToken) {
        return NextResponse.next();
    }

    const refreshRes = await fetch(`${NEST}/auth/refresh`, {
        method: 'POST',
        headers: {
            cookie: req.headers.get('cookie') ?? '',
            'content-type': 'application/json',
        },
        cache: 'no-store',
    });

    if (!refreshRes.ok) {
        return NextResponse.next();
    }

    const res = NextResponse.next();
    forwardSetCookies(refreshRes, res);
    return res;
}
