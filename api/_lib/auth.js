import crypto from 'node:crypto';

function safeEqual(a = '', b = '') {
  const aa = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (aa.length !== bb.length) return false;
  return crypto.timingSafeEqual(aa, bb);
}

export function isAdmin(req) {
  const expected = process.env.LUMA_ADMIN_TOKEN;
  if (!expected) return false;
  const header = req.headers?.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  return safeEqual(token, expected);
}

export function isCron(req) {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  return safeEqual(req.headers?.authorization || '', `Bearer ${expected}`);
}
