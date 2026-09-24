import { isCron } from './_lib/auth.js';
import { runPulseResearch } from './_lib/research.js';
import { readHistory, readJson, storageReady, writeJson } from './_lib/storage.js';

export const maxDuration = 60;

export default async function handler(req,res){
  if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'});
  if(!isCron(req))return res.status(401).json({error:'Unauthorized'});
  if(!storageReady())return res.status(503).json({error:'Vercel Blob is not configured.'});
  try{let history=await readHistory();if(!history.length){const published=await readJson('published');if(published)history=[published];}const candidate=await runPulseResearch({history});await writeJson('candidate',candidate);return res.status(200).json({ok:true,issue:candidate.meta.issue,candidates:candidate.trends.length,historyEditions:history.length,generatedAt:candidate.meta.generatedAt});}
  catch(error){return res.status(500).json({error:error.message});}
}
