// Shared auth helpers for the /api/* functions.
// The token format must stay in sync with netlify/edge-functions/auth-gate.js:
//   base64url(JSON payload) + "." + base64url(HMAC-SHA256(SESSION_SECRET, payloadPart))

import crypto from 'node:crypto';

export const SESSION_COOKIE = 'cv_session';
export const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // seconds

export const getEnv = (name) => {
    const value = process.env[name];
    if (!value) throw new Error(`Missing environment variable ${name}`);
    return value;
};

const hmac = (value) =>
    crypto.createHmac('sha256', getEnv('SESSION_SECRET')).update(value).digest('base64url');

export const signSession = (maxAgeSeconds = SESSION_MAX_AGE) => {
    const payload = Buffer.from(
        JSON.stringify({ exp: Date.now() + maxAgeSeconds * 1000 })
    ).toString('base64url');
    return `${payload}.${hmac(payload)}`;
};

export const buildCookie = (token, maxAgeSeconds) =>
    `${SESSION_COOKIE}=${token}; Path=/; Max-Age=${maxAgeSeconds}; HttpOnly; Secure; SameSite=Lax`;

// Hashing both sides first gives equal-length buffers, which timingSafeEqual requires.
export const safeEqual = (a, b) => {
    const hashA = crypto.createHash('sha256').update(String(a)).digest();
    const hashB = crypto.createHash('sha256').update(String(b)).digest();
    return crypto.timingSafeEqual(hashA, hashB);
};

export const hashOtp = (otp) => hmac(`otp:${otp}`);

export const json = (body, status = 200, headers = {}) =>
    new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json', ...headers },
    });

export const readJson = async (req) => {
    try {
        return await req.json();
    } catch {
        return {};
    }
};
