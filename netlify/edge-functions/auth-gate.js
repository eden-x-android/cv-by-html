// Blocks every request (HTML, JS bundle, images) until the visitor holds a
// valid session cookie. Token format must stay in sync with
// netlify/functions/_lib/session.js.

const SESSION_COOKIE = 'cv_session';

const base64UrlToBytes = (value) => {
    const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
};

const isValidSession = async (token, secret) => {
    if (!token || !secret) return false;
    const [payload, signature] = token.split('.');
    if (!payload || !signature) return false;

    try {
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
            'raw',
            encoder.encode(secret),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['verify']
        );
        const isSigned = await crypto.subtle.verify(
            'HMAC',
            key,
            base64UrlToBytes(signature),
            encoder.encode(payload)
        );
        if (!isSigned) return false;

        const { exp } = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payload)));
        return typeof exp === 'number' && Date.now() < exp;
    } catch {
        return false;
    }
};

export default async (request, context) => {
    const token = context.cookies.get(SESSION_COOKIE);
    const secret = Netlify.env.get('SESSION_SECRET');

    if (await isValidSession(token, secret)) {
        return context.next();
    }

    const accept = request.headers.get('accept') || '';
    if (request.method === 'GET' && accept.includes('text/html')) {
        return Response.redirect(new URL('/login/', request.url), 302);
    }
    return new Response('Unauthorized', { status: 401 });
};

export const config = {
    path: '/*',
    excludedPath: ['/login/*', '/api/*', '/fonts/*', '/favicon.svg'],
};
