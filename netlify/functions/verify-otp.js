import { getStore } from '@netlify/blobs';
import {
    SESSION_MAX_AGE,
    buildCookie,
    getEnv,
    hashOtp,
    json,
    readJson,
    safeEqual,
    signSession,
} from './_lib/session.js';

const MAX_ATTEMPTS = 5;

export default async (req) => {
    const { username, otp } = await readJson(req);
    const invalid = () => json({ ok: false, error: 'invalid' }, 401);

    if (typeof username !== 'string' || typeof otp !== 'string') return invalid();
    if (!safeEqual(username.trim(), getEnv('AUTH_USERNAME'))) return invalid();

    const store = getStore({ name: 'auth', consistency: 'strong' });
    const record = await store.get('otp', { type: 'json' });

    if (!record) return json({ ok: false, error: 'expired' }, 401);

    if (Date.now() > record.exp || record.attempts >= MAX_ATTEMPTS) {
        await store.delete('otp');
        return json({ ok: false, error: 'expired' }, 401);
    }

    if (!safeEqual(hashOtp(otp.trim()), record.hash)) {
        const attempts = record.attempts + 1;
        if (attempts >= MAX_ATTEMPTS) {
            await store.delete('otp');
            return json({ ok: false, error: 'expired' }, 401);
        }
        await store.setJSON('otp', { ...record, attempts });
        return json({ ok: false, error: 'invalid', attemptsLeft: MAX_ATTEMPTS - attempts }, 401);
    }

    await store.delete('otp');
    return json({ ok: true }, 200, {
        'Set-Cookie': buildCookie(signSession(), SESSION_MAX_AGE),
    });
};

export const config = {
    path: '/api/verify-otp',
    method: 'POST',
};
