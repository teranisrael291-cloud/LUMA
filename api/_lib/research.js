import { SOURCE_CATALOG, RESEARCH_TERMS, publicSourceCatalog } from './sources.js';

const STOP = new Set(`a al algo algunas algunos ante antes como con contra cual cuando de del desde donde durante e el ella ellas ellos en entre era eramos es esa esas ese eso esos esta estas este esto estos fue fueron ha hacia hasta hay la las le les lo los mas me mi mis muy no nos o para pero por porque que quien se sin sobre su sus te tu tus un una uno unas unos y ya the a an and are as at be by for from has have how in into is it its of on or our that the their this to was were what when where who why will with you your trend trends tendencia tendencias mexico méxico latam latinoamerica latinoamérica 2026 2025`.split(/\s+/));

const TREND_TERMS = new Set(`tendencia tendencias trend trends viral auge crece crecimiento emergente rising popular cultura cultural estética aesthetic estilo consumo consumidor creator creators creador creadores social tiktok instagram youtube pinterest moda fashion belleza beauty food comida bebida retail ecommerce e-commerce viaje travel wellness bienestar fitness música music gaming gamer tecnología tech productividad lifestyle generación gen z millennial millennials joven jóvenes`.split(/\s+/));

const BLOCK_TERMS = new Set(`elección elecciones candidato candidata presidente presidenta partido congreso senado diputado diputada asesinato asesinado homicidio secuestro detenido detención crimen criminal huracán tormenta terremoto sismo guerra ataque muertos muerte tragedia desastre`.split(/\s+/));

const CATEGORY_LEXICON = {
  'Beauty': ['beauty','belleza','maquillaje','makeup','uñas','nails','cabello','hair','skin','skincare','perfume','fragancia','grooming'],
  'Fashion': ['fashion','moda','look','outfit','ropa','vestido','jacket','chaqueta','zapatos','sneakers','style','estilo','color','aesthetic','estética'],
  'Food & Beverage': ['food','comida','bebida','drink','restaurant','restaurante','café','coffee','receta','recipe','snack','meal','cocina','gastronomía'],
  'Retail & e-commerce': ['retail','ecommerce','e-commerce','compra','compras','shopping','shop','marketplace','venta','ventas','commerce','consumer','consumidor'],
  'Travel & Experiences': ['travel','viaje','viajes','turismo','hotel','destination','destino','vacaciones','experiencia','experiences','evento','eventos','festival'],
  'Wellness & Fitness': ['wellness','bienestar','fitness','salud','health','running','correr','gym','sueño','sleep','mental','mindfulness','proteína','protein'],
  'Tech & Productivity': ['tech','tecnología','app','apps','ai','ia','software','device','gadget','productividad','productivity','digital','creator tools'],
  'Entertainment & Music': ['music','música','song','canción','artist','artista','concert','concierto','serie','series','movie','película','streaming','fandom','meme','memes'],
  'Gaming & Sports': ['gaming','gamer','videojuego','videojuegos','sport','sports','deporte','fútbol','football','soccer','nba','nfl','mlb','esports'],
  'Finance & Value': ['finance','finanzas','precio','price','ahorro','saving','budget','presupuesto','quincena','wallet','pago','payments','bnpl','valor'],
  'Culture': ['culture','cultura','social','creator','creador','creadores','community','comunidad','identity','identidad','lifestyle','viral']
};

const GENZ = new Set(`genz gen-z zeta tiktok meme memes fandom gaming gamer anime kpop festival festivals aesthetic estética viral creator creators creador creadores campus estudiante estudiantes thrift y2k streetwear sneaker sneakers`.split(/\s+/));
const MILLENNIAL = new Set(`millennial millennials hogar home hipoteca mortgage carrera career trabajo work productividad productivity wellness bienestar travel viaje viajes ahorro saving finanzas finance parenting padres coffee café skincare retail ecommerce`.split(/\s+/));

const CREATOR_BY_CATEGORY = {
  'Beauty':'Beauty · skincare · makeup · GRWM · expert explainers', 'Fashion':'Fashion · styling · streetwear · personal style',
  'Food & Beverage':'Food · cafés · recetas · local discovery', 'Retail & e-commerce':'Lifestyle · reviews · value finds · shopping guides',
  'Travel & Experiences':'Travel · city guides · experiences · hospitality', 'Wellness & Fitness':'Wellness · fitness · routines · expert-led creators',
  'Tech & Productivity':'Tech · productivity · desk/setup · explainers', 'Entertainment & Music':'Entertainment · music · fandom · commentary',
  'Gaming & Sports':'Gaming · sports culture · commentary · community', 'Finance & Value':'Personal finance · value · smart shopping · lifestyle',
  'Culture':'Culture · lifestyle · commentary · community creators'
};

const IMPACT_BY_CATEGORY = {
  'Beauty':'Puede traducirse en tutoriales, pruebas reales y formatos de rutina donde el producto aparece dentro de un comportamiento que ya interesa a la audiencia.',
  'Fashion':'Abre territorio para styling, reinterpretación local y contenido de identidad personal; funciona mejor cuando el creator ya pertenece a la estética.',
  'Food & Beverage':'Tiene potencial para descubrimiento local, recetas, reseñas y rituales cotidianos que convierten una señal cultural en una experiencia tangible.',
  'Retail & e-commerce':'Puede ayudar a conectar intención con compra mediante comparativas, recomendaciones, value finds y contenido útil cerca del momento de decisión.',
  'Travel & Experiences':'Puede convertirse en itinerarios, descubrimiento local y experiencias creator-led con alto potencial visual y de guardado.',
  'Wellness & Fitness':'Funciona mejor como contenido práctico y creíble: rutinas, hábitos y explicaciones claras, evitando claims de salud no sustentados.',
  'Tech & Productivity':'Permite demostrar utilidad con workflows, comparativas y contenido de uso real en lugar de mensajes puramente promocionales.',
  'Entertainment & Music':'La oportunidad está en participar desde fandoms y códigos culturales existentes, no en insertar la marca de forma artificial.',
  'Gaming & Sports':'La relevancia viene de comunidad y participación. Conviene trabajar con creators que ya hablan el lenguaje del fandom.',
  'Finance & Value':'La señal favorece contenido que justifica valor, compara opciones y reduce fricción en decisiones de compra.',
  'Culture':'La oportunidad es entrar mediante creators con legitimidad cultural y una ejecución nativa, antes de que la señal se vuelva demasiado masiva.'
};

function decodeXml(value='') {
  return String(value).replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(Number(n)));
}
function stripHtml(value='') { return decodeXml(value).replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim(); }
function extractTag(xml, tag) { const m=xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`,'i')); return m ? stripHtml(m[1]) : ''; }
function extractRawTag(xml, tag) { const m=xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`,'i')); return m ? decodeXml(m[1]).trim() : ''; }
function clamp(n,min=0,max=100){ return Math.max(min,Math.min(max,n)); }
function daysAgo(date){ const d=new Date(date); return Number.isFinite(d.getTime()) ? Math.max(0,(Date.now()-d.getTime())/86400000) : 30; }
function isoWeek(date) { const d=new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate())); d.setUTCDate(d.getUTCDate()+4-(d.getUTCDay()||7)); const y=new Date(Date.UTC(d.getUTCFullYear(),0,1)); return Math.ceil((((d-y)/86400000)+1)/7); }
function slug(s){ return normalizeText(s).split(' ').slice(0,8).join('-').replace(/[^a-z0-9-]/g,'').slice(0,64) || `signal-${Date.now()}`; }
function normalizeText(s=''){ return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9ñáéíóúü\s-]/gi,' ').replace(/\s+/g,' ').trim(); }
function stem(w){ return w.replace(/(amientos|imientos|aciones|adores|adoras|mente|idades|idad|ando|iendo|es|os|as|s|ing|ed)$/,''); }
function tokens(s=''){ return normalizeText(s).split(/\s+/).filter(w=>w.length>2&&!STOP.has(w)).map(stem).filter(Boolean); }
function unique(arr){ return [...new Set(arr)]; }
function titleCase(s){ return s.replace(/\b\w/g,c=>c.toUpperCase()); }
function safeUrl(u){ try { const x=new URL(u); return ['http:','https:'].includes(x.protocol)?x.toString():''; } catch { return ''; } }

function parseRss(xml, source) {
  const items=[]; const blocks=xml.match(/<item\b[\s\S]*?<\/item>/gi)||[];
  for(const block of blocks){
    const title=extractTag(block,'title'); const link=extractRawTag(block,'link'); const pubDate=extractTag(block,'pubDate')||extractTag(block,'dc:date');
    const description=extractTag(block,'description'); const traffic=extractTag(block,'ht:approx_traffic');
    if(!title||!link) continue;
    items.push({ id:`${source.id}:${slug(title)}`, title:cleanTitle(title,source.name), url:link, publishedAt:pubDate||new Date().toISOString(), description, traffic, source });
  }
  return items;
}
function cleanTitle(title, sourceName=''){
  let t=String(title).replace(/\s+-\s+[^-]{2,45}$/,'').replace(/\s+\|\s+[^|]{2,45}$/,'').trim();
  if(sourceName) t=t.replace(new RegExp(`\\s*[-|]\\s*${sourceName.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}.*$`,'i'),'').trim();
  return t.length>118?t.slice(0,115).replace(/\s+\S*$/,'')+'…':t;
}

async function fetchText(url, timeout=9000){
  const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),timeout);
  try { const r=await fetch(url,{redirect:'follow',signal:controller.signal,headers:{'user-agent':'Mozilla/5.0 (compatible; LUMAPulse/1.0; +https://luma-creators.vercel.app)','accept':'text/html,application/rss+xml,application/xml;q=0.9,*/*;q=0.8'}}); if(!r.ok) throw new Error(`HTTP ${r.status}`); return { text:await r.text(), finalUrl:r.url, contentType:r.headers.get('content-type')||'' }; }
  finally { clearTimeout(timer); }
}

function googleNewsUrl(source){
  const q=`site:${source.domain} (${RESEARCH_TERMS.join(' OR ')}) when:30d`;
  const english=['trendwatching.com','explodingtopics.com','mintel.com','wgsn.com','newsroom.spotify.com'].includes(source.domain);
  const p=new URLSearchParams({q,hl:english?'en-US':'es-419',gl:'MX',ceid:english?'US:en':'MX:es-419'});
  return `https://news.google.com/rss/search?${p}`;
}

async function collectSource(source){
  const started=Date.now();
  try{
    const url=source.direct||googleNewsUrl(source); const {text}=await fetchText(url,8000); const items=parseRss(text,source).slice(0,18);
    return {source:source.id,ok:true,count:items.length,ms:Date.now()-started,items};
  }catch(error){ return {source:source.id,ok:false,count:0,ms:Date.now()-started,error:error.name==='AbortError'?'timeout':String(error.message||error),items:[]}; }
}

function relevance(article){
  const ts=tokens(`${article.title} ${article.description}`); if(!ts.length)return 0;
  const trendHits=ts.filter(t=>TREND_TERMS.has(t)).length; const blocked=ts.filter(t=>BLOCK_TERMS.has(t)).length;
  const sourceBonus=article.source.type==='trend-research'||article.source.type==='platform-editorial'||article.source.type==='market-research'?0.16:0;
  return clamp((trendHits/Math.min(12,ts.length))*1.8 + sourceBonus - blocked*0.22,0,1);
}
function blockedArticle(article){ const ts=tokens(`${article.title} ${article.description}`); return ts.filter(t=>BLOCK_TERMS.has(t)).length>=2; }

async function enrichArticle(article){
  if(article.source.type==='search-signal') return {...article,body:`${article.title}. ${article.description}`};
  try{
    const {text,finalUrl}=await fetchText(article.url,6500);
    const desc=(text.match(/<meta[^>]+(?:name|property)=["'](?:description|og:description)["'][^>]+content=["']([^"']+)["']/i)||text.match(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["'](?:description|og:description)["']/i)||[])[1]||'';
    const articleHtml=(text.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)||[])[1]||'';
    const body=stripHtml(articleHtml||desc||article.description).slice(0,7000);
    return {...article,url:safeUrl(finalUrl)||article.url,description:stripHtml(desc)||article.description,body:body||`${article.title}. ${article.description}`};
  }catch{ return {...article,body:`${article.title}. ${article.description}`}; }
}

function buildIdf(docs){
  const df=new Map(); for(const doc of docs){ for(const t of new Set(doc._tokens)) df.set(t,(df.get(t)||0)+1); }
  const n=docs.length||1; const idf=new Map(); for(const [t,c] of df) idf.set(t,Math.log((1+n)/(1+c))+1); return idf;
}
function vector(doc,idf){ const tf=new Map(); for(const t of doc._tokens)tf.set(t,(tf.get(t)||0)+1); const v=new Map(); const denom=doc._tokens.length||1; for(const [t,c] of tf)v.set(t,(c/denom)*(idf.get(t)||1)); return v; }
function cosine(a,b){ let dot=0,aa=0,bb=0; for(const v of a.values())aa+=v*v; for(const v of b.values())bb+=v*v; const [small,other]=a.size<b.size?[a,b]:[b,a]; for(const [k,v] of small)dot+=v*(other.get(k)||0); return dot/(Math.sqrt(aa)*Math.sqrt(bb)||1); }
function jaccard(a,b){ const A=new Set(a),B=new Set(b); let i=0; for(const x of A)if(B.has(x))i++; return i/(A.size+B.size-i||1); }

function clusterArticles(articles){
  const docs=articles.map(a=>({...a,_tokens:tokens(`${a.title} ${a.description} ${a.body||''}`).slice(0,220)})); const idf=buildIdf(docs); docs.forEach(d=>d._vector=vector(d,idf));
  const parent=docs.map((_,i)=>i); const find=i=>parent[i]===i?i:(parent[i]=find(parent[i])); const union=(a,b)=>{a=find(a);b=find(b);if(a!==b)parent[b]=a;};
  for(let i=0;i<docs.length;i++)for(let j=i+1;j<docs.length;j++){
    const sameCategory=classifyCategory(docs[i])===classifyCategory(docs[j]); const sim=cosine(docs[i]._vector,docs[j]._vector); const titleSim=jaccard(tokens(docs[i].title),tokens(docs[j].title));
    if((sim>=0.31&&sameCategory)||(titleSim>=0.28&&sim>=0.16))union(i,j);
  }
  const groups=new Map(); docs.forEach((d,i)=>{const r=find(i);if(!groups.has(r))groups.set(r,[]);groups.get(r).push(d);});
  return [...groups.values()];
}

function classifyCategory(articleOrCluster){
  const text=Array.isArray(articleOrCluster)?articleOrCluster.map(x=>`${x.title} ${x.description}`).join(' '):`${articleOrCluster.title} ${articleOrCluster.description||''}`;
  const ts=tokens(text); let best='Culture',bestScore=0;
  for(const [cat,words] of Object.entries(CATEGORY_LEXICON)){ const W=words.map(stem); const s=ts.reduce((n,t)=>n+(W.includes(t)?1:0),0); if(s>bestScore){best=cat;bestScore=s;} }
  return best;
}
function inferAudience(cluster){
  const text=normalizeText(cluster.map(x=>`${x.title} ${x.description}`).join(' ')); if(/gen\s*z|generacion\s*z|generación\s*z/.test(text)&&/millennial/.test(text))return ['Both','Menciona explícitamente a Gen Z y Millennials en la evidencia recopilada.'];
  if(/gen\s*z|generacion\s*z|generación\s*z/.test(text))return ['Gen Z','La evidencia recopilada menciona explícitamente a Gen Z.'];
  if(/millennial/.test(text))return ['Millennials','La evidencia recopilada menciona explícitamente a Millennials.'];
  const ts=tokens(text); const gz=ts.filter(t=>GENZ.has(t)).length; const ml=ts.filter(t=>MILLENNIAL.has(t)).length;
  if(gz>=ml+3)return ['Gen Z','Afinidad inferida por el tipo de señal y sus códigos culturales; no se presenta como medición demográfica de plataforma.'];
  if(ml>=gz+3)return ['Millennials','Afinidad inferida por el tipo de señal y contexto de consumo; no se presenta como medición demográfica de plataforma.'];
  return ['Both','La señal cruza intereses relevantes para adultos Gen Z y Millennials; la afinidad es una clasificación editorial, no una medición demográfica.'];
}
function inferRegion(cluster){
  const text=normalizeText(cluster.map(x=>`${x.title} ${x.description}`).join(' '));
  if(/mexico|cdmx|mexican|mexicano|mexicana|guadalajara|monterrey/.test(text)||cluster.some(x=>x.source.region==='MX'))return ['MX','México'];
  if(/latam|latinoamerica|latin america|brasil|brazil|argentina|colombia|chile|peru/.test(text)||cluster.some(x=>x.source.region==='LATAM'))return ['LATAM','Latinoamérica'];
  return ['GLOBAL','Global'];
}

function sentenceSplit(text){ return stripHtml(text).replace(/\s+/g,' ').split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÑ¿¡0-9])/).map(s=>s.trim()).filter(s=>s.length>=35&&s.length<=360); }
function textRankSummary(cluster,maxSentences=2){
  const sentences=unique(cluster.flatMap(x=>sentenceSplit(`${x.description||''}. ${x.body||''}`))).slice(0,60); if(!sentences.length)return cleanTitle(cluster[0]?.title||'Señal emergente');
  const docs=sentences.map(s=>({_tokens:tokens(s).slice(0,80)})); const idf=buildIdf(docs); const vec=docs.map(d=>vector(d,idf)); const n=sentences.length; const scores=Array(n).fill(1/n);
  for(let iter=0;iter<14;iter++){ const next=Array(n).fill(0.15/n); for(let i=0;i<n;i++){ let sum=0; const sims=[]; for(let j=0;j<n;j++){if(i===j){sims[j]=0;continue;}sims[j]=cosine(vec[i],vec[j]);sum+=sims[j];} if(sum)for(let j=0;j<n;j++)next[j]+=0.85*scores[i]*(sims[j]/sum); } for(let i=0;i<n;i++)scores[i]=next[i]; }
  const picked=scores.map((s,i)=>({s,i})).sort((a,b)=>b.s-a.s).slice(0,maxSentences).sort((a,b)=>a.i-b.i).map(x=>sentences[x.i]);
  return picked.join(' ').slice(0,520);
}
function topKeywords(cluster,n=5){
  const docs=cluster.map(x=>({_tokens:tokens(`${x.title} ${x.description} ${x.body||''}`).slice(0,200)})); const idf=buildIdf(docs); const scores=new Map();
  for(const d of docs){const v=vector(d,idf);for(const [t,s] of v)scores.set(t,(scores.get(t)||0)+s);} return [...scores].sort((a,b)=>b[1]-a[1]).map(x=>x[0]).filter(x=>x.length>3).slice(0,n);
}
function centralArticle(cluster){
  if(cluster.length===1)return cluster[0]; const docs=cluster.map(x=>({...x,_tokens:tokens(`${x.title} ${x.description}`)})); const idf=buildIdf(docs); const vec=docs.map(d=>vector(d,idf)); let best=0,bestScore=-1;
  for(let i=0;i<docs.length;i++){let s=0;for(let j=0;j<docs.length;j++)if(i!==j)s+=cosine(vec[i],vec[j]);if(s>bestScore){best=i;bestScore=s;}} return cluster[best];
}
function hashUnit(s){ let h=2166136261; for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619);} return ((h>>>0)%1000)/1000; }
function buildSeries(score,stage,id){
  const delta={Spark:22,Rising:18,Accelerating:25,Building:12,Mainstream:5,Cooling:-12,Shift:8}[stage]??10; const jitter=(hashUnit(id)-0.5)*4; const start=clamp(score-delta-jitter,18,95); const arr=[];
  for(let i=0;i<6;i++){ const t=i/5; let v=start+(score-start)*t; if(stage==='Cooling')v=clamp(score+12-(12*t),10,100); arr.push(Math.round(clamp(v+(i===5?0:(hashUnit(`${id}-${i}`)-0.5)*5),0,100))); } arr[5]=Math.round(score); return arr;
}
function networkScores(cluster,score,category){
  const base={TikTok:35,Instagram:35,YouTube:35,Google:35,Pinterest:35}; const domains=cluster.map(x=>x.source.domain);
  if(domains.some(x=>x.includes('tiktok')))base.TikTok=88; if(domains.some(x=>x.includes('youtube')))base.YouTube=88; if(domains.some(x=>x.includes('pinterest')))base.Pinterest=88; if(cluster.some(x=>x.source.type==='search-signal'||x.source.domain.includes('google')))base.Google=88;
  if(['Beauty','Fashion','Food & Beverage','Travel & Experiences'].includes(category)){base.Instagram=Math.max(base.Instagram,64);base.Pinterest=Math.max(base.Pinterest,68);base.TikTok=Math.max(base.TikTok,65);} if(['Entertainment & Music','Gaming & Sports','Tech & Productivity'].includes(category)){base.YouTube=Math.max(base.YouTube,70);base.TikTok=Math.max(base.TikTok,66);}
  return Object.fromEntries(Object.entries(base).map(([k,v])=>[k,Math.round(clamp(v+(score-65)*0.25,20,95))]));
}
function parseTraffic(s=''){ const m=String(s).replace(/,/g,'').match(/([\d.]+)\s*([KkMm])?\+?/); if(!m)return 0; let n=Number(m[1]); if(m[2]?.toLowerCase()==='k')n*=1000;if(m[2]?.toLowerCase()==='m')n*=1000000;return n; }

function scoreCluster(cluster){
  const sources=unique(cluster.map(x=>x.source.id)); const types=unique(cluster.map(x=>x.source.type)); const avgAuthority=cluster.reduce((s,x)=>s+x.source.authority,0)/cluster.length; const avgAge=cluster.reduce((s,x)=>s+daysAgo(x.publishedAt),0)/cluster.length;
  const recency=Math.exp(-avgAge/18); const cross=clamp(Math.log2(1+sources.length)/2.5,0,1); const typeDiversity=clamp(types.length/4,0,1); const hasMX=cluster.some(x=>x.source.region==='MX')?1:cluster.some(x=>x.source.region==='LATAM')?0.75:0.48; const searchTraffic=Math.max(...cluster.map(x=>parseTraffic(x.traffic)),0); const searchBoost=searchTraffic?clamp(Math.log10(searchTraffic+1)/6,0,1):0;
  const commercial=['Beauty','Fashion','Food & Beverage','Retail & e-commerce','Travel & Experiences','Wellness & Fitness','Tech & Productivity','Entertainment & Music','Gaming & Sports','Finance & Value'].includes(classifyCategory(cluster))?0.88:0.68;
  const momentum=clamp(0.56*recency+0.24*cross+0.20*searchBoost,0,1); const evidence=clamp(0.65*cross+0.35*typeDiversity,0,1);
  const raw=100*(0.27*momentum+0.23*hasMX+0.20*evidence+0.16*avgAuthority+0.14*commercial); const score=Math.round(clamp(raw,28,96));
  let stage='Building'; if(avgAge<=5&&sources.length<=1)stage='Spark'; if(score>=72)stage='Rising'; if(score>=82&&sources.length>=3)stage='Accelerating'; if(sources.length>=5&&avgAge>12)stage='Mainstream'; if(avgAge>24&&recency<0.3)stage='Cooling';
  return {score,stage,sources,types,avgAuthority,avgAge,momentum,evidence,searchTraffic};
}

function trendFromCluster(cluster,index){
  const rep=centralArticle(cluster); const category=classifyCategory(cluster); const [audience,audienceWhy]=inferAudience(cluster); const [region,regionLabel]=inferRegion(cluster); const stats=scoreCluster(cluster); const kws=topKeywords(cluster,5); const summary=textRankSummary(cluster,2); const id=`${slug(rep.title)}-${index+1}`;
  const observed=stats.searchTraffic?`${Intl.NumberFormat('es-MX',{notation:'compact'}).format(stats.searchTraffic)}+ búsquedas`:`${stats.sources.length} ${stats.sources.length===1?'fuente':'fuentes'} · ${cluster.length} ${cluster.length===1?'señal':'señales'}`;
  const watchout=stats.sources.length===1?'Evidencia temprana: por ahora depende de una sola fuente. Conviene confirmar persistencia o una segunda señal antes de convertirla en una campaña grande.':stats.avgAge>18?'La señal tiene persistencia, pero puede estar acercándose a una fase madura. Prioriza una ejecución distintiva en lugar de copiar el formato.':'La evidencia cruza varias publicaciones, pero el fit cultural debe validarse por categoría y comunidad antes de activar.';
  return { id,title:cleanTitle(rep.title),kicker:`${category.toUpperCase()} · ${stats.stage.toUpperCase()}`,region,regionLabel,stage:stats.stage,segment:category,segments:[category],audience,audienceWhy,score:stats.score,metric:observed,metricLabel:stats.searchTraffic?'Google Trends / búsqueda':'Evidencia recopilada',platform:rep.source.name,summary:summary||`${rep.title}.`,impact:IMPACT_BY_CATEGORY[category]||IMPACT_BY_CATEGORY.Culture,creator:CREATOR_BY_CATEGORY[category]||CREATOR_BY_CATEGORY.Culture,watchout,source:rep.source.name,sourceUrl:safeUrl(rep.url)||`https://${rep.source.domain}`,series:buildSeries(stats.score,stats.stage,id),networks:networkScores(cluster,stats.score,category),keywords:kws,evidence:cluster.slice(0,8).map(x=>({title:x.title,source:x.source.name,url:safeUrl(x.url)||`https://${x.source.domain}`,publishedAt:x.publishedAt})),model:{momentum:Number(stats.momentum.toFixed(3)),evidence:Number(stats.evidence.toFixed(3)),authority:Number(stats.avgAuthority.toFixed(3)),ageDays:Number(stats.avgAge.toFixed(1))} };
}

function buildIndustries(trends){
  const cats=Object.keys(CATEGORY_LEXICON); const groups=cats.map(name=>({name,items:trends.filter(t=>t.segment===name)})).filter(x=>x.items.length).sort((a,b)=>Math.max(...b.items.map(x=>x.score))-Math.max(...a.items.map(x=>x.score))).slice(0,7);
  return groups.map((g,i)=>{ const top=[...g.items].sort((a,b)=>b.score-a.score); const avg=Math.round(top.reduce((s,x)=>s+x.score,0)/top.length); return {id:slug(g.name),name:g.name,score:avg,mood:top[0].stage==='Accelerating'?'Momentum alto':'Señales en construcción',fact:`${top.length} señal${top.length===1?'':'es'} detectada${top.length===1?'':'s'} en el research actual; score medio ${avg}/100.`,signals:top.slice(0,3).map(x=>x.title).concat(['Señal en observación','Señal en observación']).slice(0,3),action:IMPACT_BY_CATEGORY[g.name]||IMPACT_BY_CATEGORY.Culture,source:unique(top.flatMap(x=>x.evidence?.map(e=>e.source)||[])).slice(0,3).join(' · ')}; });
}

function editorialFromTrends(trends){
  const top=[...trends].sort((a,b)=>b.score-a.score).slice(0,3); const cats=unique(top.map(x=>x.segment));
  return {eyebrow:'LUMA / PULSE',headline:'Lo que está ganando momentum esta semana.',deck:`Señales detectadas automáticamente entre fuentes de México, LATAM y contexto global, con foco en Gen Z y Millennials. Esta semana destacan ${cats.slice(0,3).join(', ')}. La selección final sigue bajo control editorial humano.`};
}

export async function runPulseResearch(){
  const now=new Date(); const week=isoWeek(now); const started=Date.now();
  const results=await Promise.all(SOURCE_CATALOG.map(collectSource)); let articles=results.flatMap(r=>r.items).filter(a=>!blockedArticle(a));
  articles=articles.map(a=>({...a,_relevance:relevance(a)})).filter(a=>a._relevance>=0.12).sort((a,b)=>(b._relevance*b.source.authority*Math.exp(-daysAgo(b.publishedAt)/28))-(a._relevance*a.source.authority*Math.exp(-daysAgo(a.publishedAt)/28)));
  const seen=new Set(); articles=articles.filter(a=>{const k=normalizeText(a.title);if(seen.has(k))return false;seen.add(k);return true;}).slice(0,90);
  const enriched=await Promise.all(articles.slice(0,54).map(enrichArticle)); const remaining=articles.slice(54).map(a=>({...a,body:`${a.title}. ${a.description}`})); const all=[...enriched,...remaining];
  const clusters=clusterArticles(all).filter(c=>c.length>=2||c[0]?._relevance>=0.34).sort((a,b)=>scoreCluster(b).score-scoreCluster(a).score);
  let trends=clusters.map(trendFromCluster).filter(t=>t.score>=45);
  // Preserve source/category diversity: at most 3 signals from the same primary source and 3 per category.
  const srcCount=new Map(),catCount=new Map(); trends=trends.filter(t=>{const s=srcCount.get(t.source)||0,c=catCount.get(t.segment)||0;if(s>=3||c>=3)return false;srcCount.set(t.source,s+1);catCount.set(t.segment,c+1);return true;}).slice(0,18);
  if(trends.length<8){ trends=clusters.slice(0,12).map(trendFromCluster).slice(0,12); }
  const mxUpdated=new Intl.DateTimeFormat('es-MX',{day:'numeric',month:'short',year:'numeric',timeZone:'America/Mexico_City'}).format(now); const mxMonth=new Intl.DateTimeFormat('es-MX',{month:'long',year:'numeric',timeZone:'America/Mexico_City'}).format(now);
  const sourceHealth=results.map(r=>({id:r.source,ok:r.ok,count:r.count,ms:r.ms,error:r.error||null}));
  const candidate={
    meta:{issue:`W${week}`,week:`Semana ${week} · ${mxUpdated}`,month:mxMonth.charAt(0).toUpperCase()+mxMonth.slice(1),updated:mxUpdated,coverage:'México · LATAM · Global · Gen Z + Millennials',methodology:'Automated source collection + TF-IDF/cosine clustering + TextRank extractive summaries + deterministic LUMA scoring. No generative AI or AI agent.',generatedAt:now.toISOString(),status:'candidate',engine:'LUMA Signal Engine v6 · classical ML/NLP',pipeline:{sources:SOURCE_CATALOG.length,sourcesOk:results.filter(r=>r.ok).length,rawItems:results.reduce((s,r)=>s+r.count,0),normalizedItems:all.length,clusters:clusters.length,candidates:trends.length,durationMs:Date.now()-started}},
    editorial:editorialFromTrends(trends),trends,industries:buildIndustries(trends),sources:publicSourceCatalog().map(s=>({...s,note:'Curated input source for the weekly ML/NLP research engine.'})),sourceHealth
  };
  if(!trends.length) throw new Error('The source collector ran but no trend candidates passed the relevance filters. Check source health in the admin and try again later.');
  return candidate;
}
