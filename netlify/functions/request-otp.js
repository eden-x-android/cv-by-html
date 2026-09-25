import crypto from 'node:crypto';
import { getStore } from '@netlify/blobs';
import { getEnv, hashOtp, json, readJson, safeEqual } from './_lib/session.js';

const OTP_TTL_MS = 5 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;

const sendOtpEmail = async (otp) => {
    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${getEnv('RESEND_API_KEY')}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from: process.env.RESEND_FROM || 'CV Builder <onboarding@resend.dev>',
            to: [getEnv('AUTH_EMAIL')],
            subject: `CV Builder login code: ${otp}`,
            text: `Your CV Builder login code is ${otp}. It expires in 5 minutes.\n\nIf you did not request this, ignore this email.`,
        }),
    });
    if (!res.ok) {
        throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
    }
};

export default async (req) => {
    const { username } = await readJson(req);

    // Same response for a wrong username so the endpoint doesn't confirm valid ones.
    if (typeof username !== 'string' || !safeEqual(username.trim(), getEnv('AUTH_USERNAME'))) {
        return json({ ok: true });
    }

    const store = getStore({ name: 'auth', consistency: 'strong' });
    const existing = await store.get('otp', { type: 'json' });
    const now = Date.now();

    if (existing && now - existing.sentAt < RESEND_COOLDOWN_MS) {
        const retryAfter = Math.ceil((RESEND_COOLDOWN_MS - (now - existing.sentAt)) / 1000);
        return json({ ok: false, error: 'cooldown', retryAfter }, 429, {
            'Retry-After': String(retryAfter),
        });
    }

    const otp = crypto.randomInt(0, 1_000_000).toString().padStart(6, '0');
    await store.setJSON('otp', {
        hash: hashOtp(otp),
        exp: now + OTP_TTL_MS,
        attempts: 0,
        sentAt: now,
    });

    try {
        await sendOtpEmail(otp);
    } catch (err) {
        console.error(err);
        await store.delete('otp');
        return json({ ok: false, error: 'email_failed' }, 502);
    }

    return json({ ok: true });
};

export const config = {
    path: '/api/request-otp',
    method: 'POST',
};
