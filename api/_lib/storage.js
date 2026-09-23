import { get, put } from '@vercel/blob';

const PATHS = {
  candidate: 'pulse/candidate.json',
  published: 'pulse/published.json'
};

// Vercel Blob supports two auth modes:
// 1) current default: project-scoped OIDC (no BLOB_READ_WRITE_TOKEN required)
// 2) legacy/static token: BLOB_READ_WRITE_TOKEN
// On Vercel, @vercel/blob resolves OIDC automatically when no static token is passed.
function authOptions() {
  return process.env.BLOB_READ_WRITE_TOKEN
    ? { token: process.env.BLOB_READ_WRITE_TOKEN }
    : {};
}

export function storageReady() {
  // A static token is enough locally. On a Vercel deployment, let the Blob SDK
  // attempt project-scoped OIDC. If no store is connected, the SDK will return
  // the real configuration/authentication error instead of a false negative.
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL);
}

export async function readJson(kind) {
  if (!storageReady()) return null;
  const pathname = PATHS[kind] || kind;
  const result = await get(pathname, {
    access: 'private',
    useCache: false,
    ...authOptions()
  });
  if (!result || result.statusCode !== 200 || !result.stream) return null;
  return new Response(result.stream).json();
}

export async function writeJson(kind, value) {
  if (!storageReady()) {
    throw new Error('Vercel Blob is not available. Connect a private Blob store to this project, or set BLOB_READ_WRITE_TOKEN for local development.');
  }
  const pathname = PATHS[kind] || kind;
  return put(pathname, JSON.stringify(value, null, 2), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
    contentType: 'application/json; charset=utf-8',
    ...authOptions()
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
    ...authOptions()
  });
}
