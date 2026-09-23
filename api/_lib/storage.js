import { get, put } from '@vercel/blob';

const PATHS = {
  candidate: 'pulse/candidate.json',
  published: 'pulse/published.json'
};

export function storageReady() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function readJson(kind) {
  if (!storageReady()) return null;
  const pathname = PATHS[kind] || kind;
  const result = await get(pathname, { access: 'private', token: process.env.BLOB_READ_WRITE_TOKEN });
  if (!result || result.statusCode !== 200 || !result.stream) return null;
  return new Response(result.stream).json();
}

export async function writeJson(kind, value) {
  if (!storageReady()) throw new Error('Vercel Blob is not configured. Add BLOB_READ_WRITE_TOKEN.');
  const pathname = PATHS[kind] || kind;
  return put(pathname, JSON.stringify(value, null, 2), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
    contentType: 'application/json; charset=utf-8',
    token: process.env.BLOB_READ_WRITE_TOKEN
  });
}

export async function archivePublished(value) {
  if (!storageReady()) return null;
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  return put(`pulse/history/${stamp}.json`, JSON.stringify(value, null, 2), {
    access: 'private',
    addRandomSuffix: false,
    cacheControlMaxAge: 60,
    contentType: 'application/json; charset=utf-8',
    token: process.env.BLOB_READ_WRITE_TOKEN
  });
}
