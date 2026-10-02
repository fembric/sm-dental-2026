import {fileURLToPath} from 'node:url';
import path from 'node:path';
export const projectRoot=fileURLToPath(new URL('.',import.meta.url));
export const outputDir=path.join(projectRoot,'dist');
const input=(process.env.BASE_PATH||'').replace(/^\/+|\/+$/g,'');
if(input&&!/^[A-Za-z0-9_.-]+$/.test(input))throw Error('BASE_PATH must be a repository name');
export const basePath=input?'/'+input:'';
export const withBasePath=html=>html.replace(/\b(href|src)="\/(?!\/)([^"]*)"/g,(_,attr,rest)=>attr+'="'+basePath+'/'+rest+'"');
