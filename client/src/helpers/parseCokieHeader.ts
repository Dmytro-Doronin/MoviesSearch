type CookieOptions = {
    path?: string;
    domain?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    maxAge?: number;
};

type ParsedCookie = {
    name: string;
    value: string;
    options: CookieOptions;
};

export const parseCookies = (setCookieHeader: string[]): ParsedCookie[] => {
    const cookies: ParsedCookie[] = [];

    for (const raw of setCookieHeader) {
        const parts = raw.split(';').map((p) => p.trim());

        const [name, ...valueParts] = parts[0].split('=');
        const value = valueParts.join('=');
        const options: CookieOptions = {};

        for (let i = 1; i < parts.length; i++) {
            const [k, v] = parts[i].split('=');
            const key = k.toLowerCase();
            const val = v?.trim();

            switch (key) {
                case 'path':
                    options.path = val;
                    break;
                case 'domain':
                    options.domain = val;
                    break;
                case 'secure':
                    options.secure = true;
                    break;
                case 'httponly':
                    options.httpOnly = true;
                    break;
                case 'sameSite':
                    if (val) {
                        const s = val.toLowerCase();
                        if (s === 'strict' || s === 'lax' || s === 'none') {
                            options.sameSite = s;
                        }
                    }
                    break;
                case 'max-age':
                    if (val && !Number.isNaN(Number(val))) options.maxAge = Number(val);
                    break;
            }
        }

        cookies.push({ name, value, options });
    }

    return cookies;
};
