import { mkdir,appendFile,readFile } from 'node:fs/promises';
import { join } from 'node:path';
export const prerender=false;
const file=()=>join(process.cwd(),'.local','guestbook.jsonl');
const headers={'Cache-Control':'no-store'};
export async function GET(){if(!import.meta.env.DEV)return Response.json({error:'Preview guestbook is unavailable on live hosting.'},{status:503,headers});try{const raw=await readFile(file(),'utf8'),messages=raw.split('\n').filter(Boolean).flatMap(line=>{try{return[JSON.parse(line)];}catch{return[];}}).slice(-100).reverse();return Response.json({messages,mode:'preview'},{headers});}catch(error){if(error.code==='ENOENT')return Response.json({messages:[],mode:'preview'},{headers});return Response.json({error:'Guestbook could not load.'},{status:500,headers});}}
export async function POST({request,cookies,url}){
 if(!import.meta.env.DEV)return Response.json({error:'Live guestbook is not connected yet.'},{status:503,headers});
 if(request.headers.get('origin')!==url.origin)return Response.json({error:'Please submit from this site.'},{status:403,headers});
 if(Number(request.headers.get('content-length')||0)>4096)return Response.json({error:'Your note is too long.'},{status:413,headers});
 const body=await request.text();if(body.length>4096)return Response.json({error:'Your note is too long.'},{status:413,headers});
 let input;try{input=JSON.parse(body);}catch{return Response.json({error:'Please check your note.'},{status:400,headers});}
 const name=typeof input.name==='string'?input.name.trim():'',message=typeof input.message==='string'?input.message.trim():'';
 if(!name||name.length>30||!message||message.length>500)return Response.json({error:'Use a name up to 30 characters and a note up to 500 characters.'},{status:400,headers});
 if(input.website)return Response.json({error:'Please try again.'},{status:400,headers});
 const previous=Number(cookies.get('mini-guestbook-last')?.value||0);if(Date.now()-previous<15000)return Response.json({error:'Give your last note a moment before posting again.'},{status:429,headers});
 const entry={id:crypto.randomUUID(),name,message,stamp:['heart','cake','coffee','star'].includes(input.stamp)?input.stamp:'heart',createdAt:Date.now()};
 try{await mkdir(join(process.cwd(),'.local'),{recursive:true});await appendFile(file(),JSON.stringify(entry)+'\n','utf8');cookies.set('mini-guestbook-last',String(Date.now()),{path:'/api/guestbook',httpOnly:true,sameSite:'strict',maxAge:15,secure:url.protocol==='https:'});return Response.json({entry},{status:201,headers});}catch{return Response.json({error:'Your note could not save. Please try again.'},{status:500,headers});}
}
