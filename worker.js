const STATIONS = {"283": "https://d3r9rhourdc02u.cloudfront.net/assets/radio/airkol07/air071_Auto.m3u8", "284": "https://d3r9rhourdc02u.cloudfront.net/assets/radio/airkol01/air065_Auto.m3u8", "285": "https://d3r9rhourdc02u.cloudfront.net/assets/radio/airkol02/air066_Auto.m3u8", "286": "https://d3r9rhourdc02u.cloudfront.net/assets/radio/airkol06/air070_Auto.m3u8", "287": "https://d3r9rhourdc02u.cloudfront.net/assets/radio/airkol05/air069_Auto.m3u8", "288": "https://d3r9rhourdc02u.cloudfront.net/assets/radio/airkol04/air068_Auto.m3u8", "292": "https://d3r9rhourdc02u.cloudfront.net/assets/radio/airkol03/air067_Auto.m3u8", "296": "https://d3r9rhourdc02u.cloudfront.net/assets/radio/airdelhi05/air005_Auto.m3u8", "5": "https://d3r9rhourdc02u.cloudfront.net/assets/radio/airdelhi01/air001_Auto.m3u8", "4": "https://d3r9rhourdc02u.cloudfront.net/assets/radio/airbang04/air036_Auto.m3u8", "2": "https://d3r9rhourdc02u.cloudfront.net/assets/radio/airdelhi03/air003_Auto.m3u8", "3": "https://d3r9rhourdc02u.cloudfront.net/assets/radio/airdelhi02/air002_Auto.m3u8", "40": "https://d3r9rhourdc02u.cloudfront.net/assets/radio/airdelhi06/air006_Auto.m3u8", "41": "https://d3r9rhourdc02u.cloudfront.net/assets/radio/airdelhi04/air004_Auto.m3u8", "115": "https://d3r9rhourdc02u.cloudfront.net/assets/radio/airbang01/air033_Auto.m3u8", "116": "https://d3r9rhourdc02u.cloudfront.net/assets/radio/airbang05/air037_Auto.m3u8", "117": "https://d3r9rhourdc02u.cloudfront.net/assets/radio/airbang02/air034_Auto.m3u8", "118": "https://d3r9rhourdc02u.cloudfront.net/assets/radio/airbang03/air035_Auto.m3u8", "169": "https://d3r9rhourdc02u.cloudfront.net/assets/radio/airmum01/air049_Auto.m3u8", "170": "https://d3r9rhourdc02u.cloudfront.net/assets/radio/airmum02/air050_Auto.m3u8", "171": "https://d3r9rhourdc02u.cloudfront.net/assets/radio/airmum04/air052_Auto.m3u8", "172": "https://d3r9rhourdc02u.cloudfront.net/assets/radio/airmum05/air053_Auto.m3u8"};
const SITE_ORIGIN='https://ashok-kumar-yadaw.github.io';
function headers(){return {'Access-Control-Allow-Origin':SITE_ORIGIN,'Access-Control-Allow-Methods':'GET, OPTIONS','Vary':'Origin','Cache-Control':'no-store'}}
export default {async fetch(request){
 const u=new URL(request.url); const cors=headers();
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
 if(request.method!=='GET')return new Response('Method not allowed',{status:405,headers:cors});
 if(u.pathname==='/')return new Response('Radio stream relay ready',{headers:cors});
 if(u.pathname!=='/stream')return new Response('Not found',{status:404,headers:cors});
 const original=STATIONS[u.searchParams.get('station')];if(!original)return new Response('Unknown station',{status:400,headers:cors});
 const root=new URL('.',original);let target;
 try{target=new URL(u.searchParams.get('url')||original)}catch{return new Response('Invalid URL',{status:400,headers:cors})}
 if(target.origin!==root.origin||!target.pathname.startsWith(root.pathname)||target.username||target.password)return new Response('Blocked resource',{status:403,headers:cors});
 try{
 const result=await fetch(target.href,{redirect:'manual',headers:{Accept:'*/*'},signal:AbortSignal.timeout(15000)});
 if(!result.ok)return new Response('Upstream HTTP '+result.status,{status:502,headers:cors});
 if(target.pathname.endsWith('.m3u8')){
  const text=await result.text();if(!text.trimStart().startsWith('#EXTM3U'))return new Response('Invalid upstream playlist',{status:502,headers:cors});
  function relay(value){const resolved=new URL(value,target);const p=new URL('/stream',u.origin);p.searchParams.set('station',u.searchParams.get('station'));p.searchParams.set('url',resolved.href);return p.href}
  const rewritten=text.split(/\r?\n/).map(line=>{if(!line.trim())return line;if(line.startsWith('#'))return line.replace(/URI="([^"]+)"/g,(_,v)=>'URI="'+relay(v)+'"');return relay(line.trim())}).join('\n');
  return new Response(rewritten,{headers:{...cors,'Content-Type':'application/vnd.apple.mpegurl'}});
 }
 return new Response(result.body,{headers:{...cors,'Content-Type':result.headers.get('content-type')||'application/octet-stream'}});
 }catch{return new Response('Upstream connection failed',{status:502,headers:cors})}
}};
