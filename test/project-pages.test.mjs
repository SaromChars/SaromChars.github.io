import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { load } from 'cheerio';
const dir=process.env.PAGES_TEST_DIR;
const site=process.env.PAGES_TEST_SITE;
const base=process.env.PAGES_TEST_BASE;
test('deployed Pages build mounts assets and metadata under its configured URL',{skip:!dir},()=>{
 const article='2018/08/04/thinking_about_ruanyifeng_signature/';
 const html=p=>load(fs.readFileSync(path.join(dir,p),'utf8'));
 const $=html(article+'index.html');
 assert.equal($('link[rel="canonical"]').attr('href'),site+base+article);
 assert.equal($('meta[name="robots"]').attr('content'),process.env.PAGES_TEST_ENV==='production'?'index, follow':'noindex, follow');
 assert.ok($('script[src*="googletagmanager.com"]').length <= 1);
 assert.equal($('textarea[id$="-code"]').length,7);
 assert.equal(fs.readFileSync(path.join(dir,'CNAME'),'utf8').trim(),'www.saromchars.tech');
 const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
 for(const f of walk(dir).filter(p=>p.endsWith('.html')&&!p.includes('/lib/'))){
  const page=load(fs.readFileSync(f,'utf8'));
  for(const el of page('a[href],script[src],link[href],img[src]').toArray()){
   const u=page(el).attr('href')??page(el).attr('src');
   if(!u.startsWith('/')||u.startsWith('//'))continue;
   assert.ok(u.startsWith(base),`${f}: unmounted ${u}`);
   const clean=decodeURI(u.split(/[?#]/)[0].slice(base.length));
   assert.ok(fs.existsSync(path.join(dir,clean))||fs.existsSync(path.join(dir,clean,'index.html')),`${f}: missing ${u}`);
  }
 }
 assert.ok(fs.readFileSync(path.join(dir,'robots.txt'),'utf8').includes(site+base+'sitemap-index.xml'));
 assert.ok(fs.readFileSync(path.join(dir,'rss.xml'),'utf8').includes(site+base+article));
 assert.ok(fs.readFileSync(path.join(dir,'sitemap-0.xml'),'utf8').includes(site+base+article));
});
