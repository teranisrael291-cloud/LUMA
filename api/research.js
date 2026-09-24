import { isAdmin } from './_lib/auth.js';
import { runPulseResearch } from './_lib/research.js';
import { readHistory, readJson, storageReady, writeJson } from './_lib/storage.js';

export const maxDuration = 60;

export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
  if(!isAdmin(req))return res.status(401).json({error:'Unauthorized'});
  if(!storageReady())return res.status(503).json({error:'Vercel Blob is not configured. Connect a private Blob store to this Vercel project before running research.'});
  try{let history=await readHistory();if(!history.length){const published=await readJson('published');if(published)history=[published];}const candidate=await runPulseResearch({history});await writeJson('candidate',candidate);return res.status(200).json({ok:true,candidate});}
  catch(error){return res.status(500).json({error:error.message});}
}
