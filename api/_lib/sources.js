export const SOURCE_CATALOG = [
  { id:'google-trends-mx', name:'Google Trends México', domain:'trends.google.com', region:'MX', type:'search-signal', authority:1.00, direct:'https://trends.google.com/trending/rss?geo=MX', tags:['culture','entertainment','sports','tech','retail'], audiences:['Gen Z','Millennials'] },
  { id:'tiktok-newsroom', name:'TikTok Newsroom LATAM', domain:'newsroom.tiktok.com', region:'LATAM', type:'platform-editorial', authority:0.98, tags:['culture','entertainment','beauty','food','retail','music'], audiences:['Gen Z','Millennials'] },
  { id:'youtube-culture', name:'YouTube Culture & Trends', domain:'blog.youtube', region:'LATAM', type:'platform-editorial', authority:0.98, tags:['culture','entertainment','gaming','music','creators'], audiences:['Gen Z','Millennials'] },
  { id:'pinterest-business', name:'Pinterest Business / Predicts', domain:'business.pinterest.com', region:'GLOBAL', type:'platform-editorial', authority:0.96, tags:['beauty','fashion','food','travel','home','culture'], audiences:['Gen Z','Millennials'] },
  { id:'think-google', name:'Think with Google LATAM', domain:'thinkwithgoogle.com', region:'LATAM', type:'market-research', authority:0.96, tags:['retail','consumer','search','video','marketing'], audiences:['Gen Z','Millennials'] },
  { id:'amvo', name:'AMVO', domain:'amvo.org.mx', region:'MX', type:'market-research', authority:0.98, tags:['retail','ecommerce','finance','consumer'], audiences:['Gen Z','Millennials'] },
  { id:'iab-mx', name:'IAB México', domain:'iabmexico.com', region:'MX', type:'market-research', authority:0.96, tags:['marketing','media','creators','retail','culture'], audiences:['Gen Z','Millennials'] },
  { id:'kantar-latam', name:'Kantar Latinoamérica', domain:'kantar.com', region:'LATAM', type:'market-research', authority:0.95, tags:['consumer','retail','beauty','food','media'], audiences:['Gen Z','Millennials'] },
  { id:'niq-mx', name:'NielsenIQ México', domain:'nielseniq.com', region:'MX', type:'market-research', authority:0.95, tags:['consumer','retail','food','beauty'], audiences:['Gen Z','Millennials'] },
  { id:'vogue-mx', name:'Vogue México', domain:'vogue.mx', region:'MX', type:'editorial', authority:0.88, tags:['fashion','beauty','wellness','culture'], audiences:['Gen Z','Millennials'] },
  { id:'gq-mx', name:'GQ México y Latinoamérica', domain:'gq.com.mx', region:'LATAM', type:'editorial', authority:0.86, tags:['fashion','grooming','wellness','entertainment','tech','culture'], audiences:['Gen Z','Millennials'] },
  { id:'glamour-mx', name:'Glamour México', domain:'glamour.mx', region:'MX', type:'editorial', authority:0.84, tags:['beauty','fashion','wellness','culture'], audiences:['Gen Z','Millennials'] },
  { id:'elle-mx', name:'ELLE México', domain:'elle.mx', region:'MX', type:'editorial', authority:0.84, tags:['fashion','beauty','culture','lifestyle'], audiences:['Gen Z','Millennials'] },
  { id:'chilango', name:'Chilango', domain:'chilango.com', region:'MX', type:'local-editorial', authority:0.84, tags:['culture','food','music','events','travel'], audiences:['Gen Z','Millennials'] },
  { id:'timeout-mx', name:'Time Out México', domain:'timeoutmexico.mx', region:'MX', type:'local-editorial', authority:0.84, tags:['culture','food','music','events','travel'], audiences:['Gen Z','Millennials'] },
  { id:'spotify-newsroom', name:'Spotify Newsroom', domain:'newsroom.spotify.com', region:'GLOBAL', type:'platform-editorial', authority:0.90, tags:['music','culture','creators'], audiences:['Gen Z','Millennials'] },
  { id:'mintel', name:'Mintel Insights', domain:'mintel.com', region:'GLOBAL', type:'trend-research', authority:0.92, tags:['consumer','beauty','food','retail','wellness'], audiences:['Gen Z','Millennials'] },
  { id:'trendwatching', name:'TrendWatching', domain:'trendwatching.com', region:'GLOBAL', type:'trend-editorial', authority:0.82, tags:['consumer','culture','retail','innovation'], audiences:['Gen Z','Millennials'] },
  { id:'exploding-topics', name:'Exploding Topics', domain:'explodingtopics.com', region:'GLOBAL', type:'trend-data', authority:0.80, tags:['tech','consumer','culture','beauty','wellness'], audiences:['Gen Z','Millennials'] },
  { id:'wgsn-public', name:'WGSN public insights', domain:'wgsn.com', region:'GLOBAL', type:'trend-research', authority:0.90, tags:['fashion','beauty','consumer','culture'], audiences:['Gen Z','Millennials'] }
];

export const RESEARCH_TERMS = [
  'tendencias OR tendencia OR trend OR trends',
  'Gen Z OR generación Z OR millennials OR jóvenes',
  'creadores OR creators OR cultura OR consumo',
  'moda OR belleza OR food OR retail OR travel OR wellness OR gaming OR música'
];

export function publicSourceCatalog() {
  return SOURCE_CATALOG.map(({ direct, ...source }) => ({ ...source, url: `https://${source.domain}` }));
}
