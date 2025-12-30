import { NextRequest, NextResponse } from 'next/server';

import { fetchNestWithRefresh } from '@/shared/api/fetchWithAuthRefresh';
import { safeJson } from '@/utils/apiUtils';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
    const { nestRes, setCookiesToForward } = await fetchNestWithRefresh(req, '/auth/me', {
        method: 'GET',
    });

    const body = await safeJson(nestRes);
    const res = NextResponse.json(body, { status: nestRes.status });

    for (const sc of setCookiesToForward) {
        res.headers.append('set-cookie', sc);
    }

    return res;
}
