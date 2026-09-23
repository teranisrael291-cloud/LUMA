import { isAdmin } from './_lib/auth.js';
import { archivePublished, readJson, storageReady, writeJson } from './_lib/storage.js';

function bodyOf(req) {
  if (!req.body) return {};
  if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch { return {}; } }
  return req.body;
}

function validEdition(edition) {
  return edition && typeof edition === 'object' && Array.isArray(edition.trends) && edition.trends.length >= 1 && edition.trends.length <= 10 && edition.meta && edition.editorial;
}

export default async function handler(req, res) {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
  try {
    if (req.method === 'GET') {
      const [candidate, published] = await Promise.all([readJson('candidate'), readJson('published')]);
      return res.status(200).json({ storageReady: storageReady(), candidate, published });
    }
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const body = bodyOf(req);
    if (body.action === 'saveCandidate') {
      if (!body.candidate || !Array.isArray(body.candidate.trends)) return res.status(400).json({ error: 'Invalid candidate.' });
      body.candidate.meta = { ...(body.candidate.meta || {}), status: 'candidate', editedAt: new Date().toISOString() };
      await writeJson('candidate', body.candidate);
      return res.status(200).json({ ok: true, candidate: body.candidate });
    }
    if (body.action === 'publish') {
      if (!validEdition(body.edition)) return res.status(400).json({ error: 'Publish 1–10 selected trends and include meta/editorial.' });
      const edition = structuredClone(body.edition);
      edition.meta.status = 'published';
      edition.meta.publishedAt = new Date().toISOString();
      edition.meta.updated = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'America/Mexico_City' }).format(new Date());
      await writeJson('published', edition);
      await archivePublished(edition);
      return res.status(200).json({ ok: true, published: edition });
    }
    return res.status(400).json({ error: 'Unknown action.' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
