import { buildCookie } from './_lib/session.js';

export default async () =>
    new Response(null, {
        status: 302,
        headers: {
            Location: '/login/',
            'Set-Cookie': buildCookie('', 0),
        },
    });

export const config = {
    path: '/api/logout',
};
