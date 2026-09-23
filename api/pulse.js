import { readJson } from './_lib/storage.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const published = await readJson('published');
    if (!published) return res.status(404).json({ error: 'No published Pulse edition yet.' });
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=120');
    return res.status(200).json(published);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
