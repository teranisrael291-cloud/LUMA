import { get, put } from '@vercel/blob';

const PATHS = {
  candidate: 'pulse/candidate.json',
  published: 'pulse/published.json',
  historyIndex: 'pulse/history-index.json'
};

function authOptions(){return process.env.BLOB_READ_WRITE_TOKEN?{token:process.env.BLOB_READ_WRITE_TOKEN}:{};}
export function storageReady(){return Boolean(process.env.BLOB_READ_WRITE_TOKEN||process.env.VERCEL);}

export async function readJson(kind){
  if(!storageReady())return null;
  const pathname=PATHS[kind]||kind;
  const result=await get(pathname,{access:'private',useCache:false,...authOptions()});
  if(!result||result.statusCode!==200||!result.stream)return null;
  return new Response(result.stream).json();
}
export async function writeJson(kind,value){
  if(!storageReady())throw new Error('Vercel Blob is not available. Connect a private Blob store to this project, or set BLOB_READ_WRITE_TOKEN for local development.');
  const pathname=PATHS[kind]||kind;
  return put(pathname,JSON.stringify(value,null,2),{access:'private',addRandomSuffix:false,allowOverwrite:true,cacheControlMaxAge:60,contentType:'application/json; charset=utf-8',...authOptions()});
}
function compactEdition(value){return{meta:{issue:value?.meta?.issue,updated:value?.meta?.updated,publishedAt:value?.meta?.publishedAt},trends:(value?.trends||[]).map(t=>({id:t.id,title:t.title,score:t.score,confidence:t.confidence,stage:t.stage,archetype:t.archetype,segment:t.segment,region:t.region,keywords:t.keywords||[],model:t.model?{momentum:t.model.momentum,persistence:t.model.persistence,velocity:t.model.velocity}:undefined}))};}
export async function archivePublished(value){
  if(!storageReady())return null;
  const stamp=new Date().toISOString().replace(/[:.]/g,'-');
  const archived=await put(`pulse/history/${stamp}.json`,JSON.stringify(value,null,2),{access:'private',addRandomSuffix:false,cacheControlMaxAge:60,contentType:'application/json; charset=utf-8',...authOptions()});
  let index=[];
  try{index=await readJson('historyIndex')||[];}catch{index=[];}
  const compact=compactEdition(value);
  index=[compact,...index.filter(x=>x?.meta?.issue!==compact.meta.issue)].slice(0,16);
  await writeJson('historyIndex',index);
  return archived;
}
export async function readHistory(){try{return await readJson('historyIndex')||[];}catch{return [];}}
