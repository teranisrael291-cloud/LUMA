export const SOURCE_CATALOG = [
  // Fast signals / platform-native culture
  { id:'google-trends-mx', name:'Google Trends México', domain:'trends.google.com', region:'MX', type:'search-signal', role:'signal', authority:1.00, direct:'https://trends.google.com/trending/rss?geo=MX', tags:['culture','entertainment','sports','tech','retail','search'], audiences:['Gen Z','Millennials'] },
  { id:'tiktok-next', name:'TikTok for Business / Next', domain:'ads.tiktok.com', region:'LATAM', type:'platform-signal', role:'signal', authority:0.99, tags:['culture','social','creators','beauty','food','retail','music'], audiences:['Gen Z','Millennials'] },
  { id:'tiktok-newsroom', name:'TikTok Newsroom LATAM', domain:'newsroom.tiktok.com', region:'LATAM', type:'platform-editorial', role:'signal', authority:0.98, tags:['culture','entertainment','beauty','food','retail','music'], audiences:['Gen Z','Millennials'] },
  { id:'youtube-culture', name:'YouTube Culture & Trends', domain:'blog.youtube', region:'LATAM', type:'platform-editorial', role:'signal', authority:0.98, tags:['culture','entertainment','gaming','music','creators'], audiences:['Gen Z','Millennials'] },
  { id:'pinterest-business', name:'Pinterest Business / Predicts', domain:'business.pinterest.com', region:'GLOBAL', type:'platform-editorial', role:'signal', authority:0.96, tags:['beauty','fashion','food','travel','home','culture'], audiences:['Gen Z','Millennials'] },
  { id:'meta-newsroom', name:'Meta Newsroom', domain:'about.fb.com', region:'GLOBAL', type:'platform-editorial', role:'signal', authority:0.96, tags:['instagram','reels','creators','culture','social','commerce'], audiences:['Gen Z','Millennials'] },
  { id:'spotify-newsroom', name:'Spotify Newsroom', domain:'newsroom.spotify.com', region:'GLOBAL', type:'platform-editorial', role:'signal', authority:0.92, tags:['music','culture','creators','audio'], audiences:['Gen Z','Millennials'] },

  // Mexico / LATAM consumer and market evidence
  { id:'think-google', name:'Think with Google LATAM', domain:'thinkwithgoogle.com', region:'LATAM', type:'market-research', role:'evidence', authority:0.97, tags:['retail','consumer','search','video','marketing'], audiences:['Gen Z','Millennials'] },
  { id:'amvo', name:'AMVO', domain:'amvo.org.mx', region:'MX', type:'market-research', role:'evidence', authority:0.99, tags:['retail','ecommerce','finance','consumer'], audiences:['Gen Z','Millennials'] },
  { id:'iab-mx', name:'IAB México', domain:'iabmexico.com', region:'MX', type:'market-research', role:'evidence', authority:0.97, tags:['marketing','media','creators','retail','culture'], audiences:['Gen Z','Millennials'] },
  { id:'comscore-latam', name:'Comscore LATAM', domain:'comscore.com', region:'LATAM', type:'market-research', role:'evidence', authority:0.96, tags:['media','social','video','audience','digital'], audiences:['Gen Z','Millennials'] },
  { id:'kantar-latam', name:'Kantar Latinoamérica', domain:'kantar.com', region:'LATAM', type:'market-research', role:'evidence', authority:0.96, tags:['consumer','retail','beauty','food','media','marketing'], audiences:['Gen Z','Millennials'] },
  { id:'niq-mx', name:'NielsenIQ México', domain:'nielseniq.com', region:'MX', type:'market-research', role:'evidence', authority:0.96, tags:['consumer','retail','food','beauty'], audiences:['Gen Z','Millennials'] },
  { id:'ipsos-mx', name:'Ipsos México', domain:'ipsos.com', region:'MX', type:'market-research', role:'evidence', authority:0.96, tags:['generations','consumer','culture','media','society'], audiences:['Gen Z','Millennials'] },
  { id:'gwi', name:'GWI', domain:'gwi.com', region:'GLOBAL', type:'market-research', role:'evidence', authority:0.93, tags:['consumer','generations','social','media','commerce'], audiences:['Gen Z','Millennials'] },
  { id:'euromonitor', name:'Euromonitor', domain:'euromonitor.com', region:'GLOBAL', type:'market-research', role:'evidence', authority:0.94, tags:['consumer','retail','food','beauty','travel'], audiences:['Gen Z','Millennials'] },
  { id:'emarketer-latam', name:'EMARKETER', domain:'emarketer.com', region:'LATAM', type:'market-research', role:'evidence', authority:0.95, tags:['marketing','social','commerce','retail','media','latam'], audiences:['Gen Z','Millennials'] },
  { id:'mintel', name:'Mintel', domain:'mintel.com', region:'GLOBAL', type:'trend-research', role:'evidence', authority:0.94, tags:['consumer','beauty','food','retail','wellness'], audiences:['Gen Z','Millennials'] },

  // Forecasting / foresight
  { id:'wgsn-public', name:'WGSN public insights', domain:'wgsn.com', region:'GLOBAL', type:'trend-research', role:'foresight', authority:0.94, tags:['fashion','beauty','consumer','culture','youth'], audiences:['Gen Z','Millennials'] },
  { id:'future-lab', name:'The Future Laboratory', domain:'thefuturelaboratory.com', region:'GLOBAL', type:'trend-research', role:'foresight', authority:0.93, tags:['consumer','culture','retail','beauty','food','travel','marketing'], audiences:['Gen Z','Millennials'] },
  { id:'trendwatching', name:'TrendWatching', domain:'trendwatching.com', region:'GLOBAL', type:'trend-research', role:'foresight', authority:0.89, tags:['consumer','culture','retail','innovation'], audiences:['Gen Z','Millennials'] },
  { id:'stylus', name:'Stylus', domain:'stylus.com', region:'GLOBAL', type:'trend-research', role:'foresight', authority:0.91, tags:['consumer','culture','food','travel','beauty','retail','technology'], audiences:['Gen Z','Millennials'] },
  { id:'canvas8', name:'Canvas8', domain:'canvas8.com', region:'GLOBAL', type:'trend-research', role:'foresight', authority:0.88, tags:['consumer','behaviour','culture','youth','brands'], audiences:['Gen Z','Millennials'] },
  { id:'contagious', name:'Contagious', domain:'contagious.com', region:'GLOBAL', type:'marketing-intelligence', role:'foresight', authority:0.88, tags:['marketing','creative','culture','brands','media'], audiences:['Gen Z','Millennials'] },
  { id:'springwise', name:'Springwise', domain:'springwise.com', region:'GLOBAL', type:'innovation-editorial', role:'foresight', authority:0.84, tags:['innovation','consumer','sustainability','technology','retail'], audiences:['Gen Z','Millennials'] },
  { id:'trendhunter', name:'Trend Hunter', domain:'trendhunter.com', region:'GLOBAL', type:'trend-data', role:'foresight', authority:0.84, tags:['consumer','innovation','culture','retail','technology'], audiences:['Gen Z','Millennials'] },
  { id:'exploding-topics', name:'Exploding Topics', domain:'explodingtopics.com', region:'GLOBAL', type:'trend-data', role:'foresight', authority:0.83, tags:['tech','consumer','culture','beauty','wellness'], audiences:['Gen Z','Millennials'] },

  // Marketing / creator economy trade press
  { id:'digiday', name:'Digiday', domain:'digiday.com', region:'GLOBAL', type:'marketing-editorial', role:'trade', authority:0.89, tags:['marketing','creators','social','media','commerce'], audiences:['Gen Z','Millennials'] },
  { id:'glossy', name:'Glossy', domain:'glossy.co', region:'GLOBAL', type:'business-editorial', role:'trade', authority:0.88, tags:['beauty','fashion','creators','retail','culture'], audiences:['Gen Z','Millennials'] },
  { id:'marketing-brew', name:'Marketing Brew', domain:'marketingbrew.com', region:'GLOBAL', type:'marketing-editorial', role:'trade', authority:0.86, tags:['marketing','creators','social','brand','media','retail'], audiences:['Gen Z','Millennials'] },
  { id:'the-drum', name:'The Drum', domain:'thedrum.com', region:'GLOBAL', type:'marketing-editorial', role:'trade', authority:0.87, tags:['marketing','social','creators','media','brand','consumer'], audiences:['Gen Z','Millennials'] },
  { id:'adweek', name:'ADWEEK', domain:'adweek.com', region:'GLOBAL', type:'marketing-editorial', role:'trade', authority:0.87, tags:['marketing','creators','social','brand','commerce'], audiences:['Gen Z','Millennials'] },
  { id:'campaign', name:'Campaign', domain:'campaignlive.com', region:'GLOBAL', type:'marketing-editorial', role:'trade', authority:0.86, tags:['marketing','creative','social','brand','media'], audiences:['Gen Z','Millennials'] },
  { id:'modern-retail', name:'Modern Retail', domain:'modernretail.co', region:'GLOBAL', type:'business-editorial', role:'trade', authority:0.84, tags:['retail','commerce','consumer','brands','creators'], audiences:['Gen Z','Millennials'] },

  // Culture / fashion / youth signals
  { id:'vogue-mx', name:'Vogue México', domain:'vogue.mx', region:'MX', type:'editorial', role:'culture', authority:0.88, tags:['fashion','beauty','wellness','culture'], audiences:['Gen Z','Millennials'] },
  { id:'gq-mx', name:'GQ México y Latinoamérica', domain:'gq.com.mx', region:'LATAM', type:'editorial', role:'culture', authority:0.87, tags:['fashion','grooming','wellness','entertainment','tech','culture'], audiences:['Gen Z','Millennials'] },
  { id:'glamour-mx', name:'Glamour México', domain:'glamour.mx', region:'MX', type:'editorial', role:'culture', authority:0.85, tags:['beauty','fashion','wellness','culture'], audiences:['Gen Z','Millennials'] },
  { id:'elle-mx', name:'ELLE México', domain:'elle.mx', region:'MX', type:'editorial', role:'culture', authority:0.85, tags:['fashion','beauty','culture','lifestyle'], audiences:['Gen Z','Millennials'] },
  { id:'chilango', name:'Chilango', domain:'chilango.com', region:'MX', type:'local-editorial', role:'culture', authority:0.85, tags:['culture','food','music','events','travel'], audiences:['Gen Z','Millennials'] },
  { id:'timeout-mx', name:'Time Out México', domain:'timeoutmexico.mx', region:'MX', type:'local-editorial', role:'culture', authority:0.85, tags:['culture','food','music','events','travel'], audiences:['Gen Z','Millennials'] },
  { id:'vogue-business', name:'Vogue Business', domain:'vogue.com', region:'GLOBAL', type:'business-editorial', role:'culture', authority:0.90, tags:['fashion','beauty','retail','luxury','consumer','technology'], audiences:['Gen Z','Millennials'] },
  { id:'bof', name:'The Business of Fashion', domain:'businessoffashion.com', region:'GLOBAL', type:'business-editorial', role:'culture', authority:0.90, tags:['fashion','beauty','creators','retail','luxury'], audiences:['Gen Z','Millennials'] },
  { id:'highsnobiety', name:'Highsnobiety', domain:'highsnobiety.com', region:'GLOBAL', type:'culture-editorial', role:'culture', authority:0.84, tags:['culture','fashion','beauty','food','travel','gen z'], audiences:['Gen Z','Millennials'] },
  { id:'dazed', name:'Dazed', domain:'dazeddigital.com', region:'GLOBAL', type:'culture-editorial', role:'culture', authority:0.83, tags:['culture','fashion','beauty','music','creators','gen z'], audiences:['Gen Z','Millennials'] },
  { id:'hypebeast', name:'Hypebeast', domain:'hypebeast.com', region:'GLOBAL', type:'culture-editorial', role:'culture', authority:0.83, tags:['culture','fashion','sneakers','music','design','youth'], audiences:['Gen Z','Millennials'] }
];

export const RESEARCH_TERMS = [
  'trend OR trends OR tendencia OR tendencias OR emerging',
  'Gen Z OR generación Z OR millennials OR youth OR jóvenes',
  'creators OR creadores OR cultura OR consumer OR consumo',
  'fashion OR moda OR beauty OR belleza OR food OR retail OR travel OR wellness OR gaming OR music',
  'social commerce OR creator marketing OR cultural shift OR consumer behaviour'
];

export function publicSourceCatalog() {
  return SOURCE_CATALOG.map(({ direct, ...source }) => ({ ...source, url: `https://${source.domain}` }));
}
