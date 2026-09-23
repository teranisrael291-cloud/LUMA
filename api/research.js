import { isAdmin } from './_lib/auth.js';
import { runPulseResearch } from './_lib/research.js';
import { storageReady, writeJson } from './_lib/storage.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
  if (!storageReady()) return res.status(503).json({ error: 'Vercel Blob is not configured. Add a Blob store before running research.' });
  try {
    const candidate = await runPulseResearch();
    await writeJson('candidate', candidate);
    return res.status(200).json({ ok: true, candidate });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
