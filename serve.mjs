import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {outputDir as base} from './site-config.mjs';
const {basePath}=JSON.parse(await readFile(path.join(base,'build-info.json'),'utf8'));
const port=Number(process.env.PORT||4286);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.json':'application/json','.txt':'text/plain; charset=utf-8','.docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document'};
http.createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://localhost');
 const pathname=decodeURIComponent(url.pathname);
 if(basePath&&pathname===basePath){res.writeHead(301,{Location:basePath+'/'});return res.end();}
 if(!pathname.startsWith(basePath+'/'))throw Error('Outside site');
 let p=path.resolve(base,'.'+pathname.slice(basePath.length));
 if(p!==base&&!p.startsWith(base+path.sep))throw Error('Outside output');
 if((await stat(p)).isDirectory()){
  if(!pathname.endsWith('/')){res.writeHead(301,{Location:url.pathname+'/'+url.search});return res.end();}
  p=path.join(p,'index.html');
 }
 res.writeHead(200,{'Content-Type':types[path.extname(p)]||'application/octet-stream'});
 res.end(await readFile(p));
}catch{res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(await readFile(path.join(base,'404.html')).catch(()=>Buffer.from('Not found')));}
}).listen(port,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:'+port+basePath+'/'));
