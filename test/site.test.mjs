import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { load } from 'cheerio';
const root=path.resolve(import.meta.dirname,'..');
const article='2018/08/04/thinking_about_ruanyifeng_signature/index.html';
const html=p=>load(fs.readFileSync(path.join(root,'dist',p),'utf8'));
const fixture=JSON.parse(fs.readFileSync(path.join(import.meta.dirname,'original-content.json')));
const normalize=s=>s.replace(/\s+/g,'');
test('preserves old routes and readable article with seven diagrams',()=>{
 for(const p of ['index.html','about/index.html','tags/index.html','categories/index.html','archives/index.html','archives/2018/index.html','archives/2018/08/index.html',article])assert.ok(fs.existsSync(path.join(root,'dist',p)),p);
 const $=html(article);assert.equal($('main h1').text().trim(),'阮一峰译数字签名--体会');
 for(const p of fixture.paragraphs)assert.ok(normalize($('#article').text()).includes(normalize(p)),p.slice(0,35));
 for(const [id,text]of Object.entries(fixture.diagrams)){assert.equal($(`#${id}`).text(),text);assert.equal($(`div#${id.replace('-code','')}`).length,1);}
 assert.equal($('meta[property="article:published_time"]').attr('content'),'2018-08-03T18:55:15.000Z');
 assert.equal($('meta[property="article:modified_time"]').length,0);
});
test('keeps legacy assets and source material out of the output',()=>{
 for(const [p,hash]of Object.entries(fixture.assets))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'dist',p))).digest('hex'),hash,p);
 for(const p of ['.site-foundry','.local','test','src','README.md'])assert.ok(!fs.existsSync(path.join(root,'dist',p)),p);
 assert.equal(fs.readFileSync(path.join(root,'dist/CNAME'),'utf8').trim(),'www.saromchars.tech');
});
test('emits one canonical article URL across metadata, listing, RSS and sitemap',()=>{
 const url='https://www.saromchars.tech/2018/08/04/thinking_about_ruanyifeng_signature/';
 const $=html(article);assert.equal($('html').attr('lang'),'zh-CN');
 assert.equal($('link[rel="canonical"]').attr('href'),url);
 assert.equal($('meta[property="og:type"]').length,1);
 assert.equal($('meta[property="og:type"]').attr('content'),'article');
 const data=JSON.parse($('script[type="application/ld+json"]').html());assert.equal(data.headline,'阮一峰译数字签名--体会');assert.equal(data.mainEntityOfPage,url);
 assert.equal(html('index.html')(`a[href="${new URL(url).pathname}"]`).length,1);
 assert.ok(fs.readFileSync(path.join(root,'dist/rss.xml'),'utf8').includes(url));
 const sitemap=fs.readFileSync(path.join(root,'dist/sitemap-0.xml'),'utf8');assert.ok(sitemap.includes(url));assert.ok(!sitemap.includes('/search/'));
 assert.equal(html('search/index.html')('meta[name="robots"]').attr('content'),'noindex, follow');
 assert.ok(!fs.existsSync(path.join(root,'dist/posts/thinking-about-ruanyifeng-signature/index.html')));
});
test('does not emit analytics or verification placeholders in default preview builds',()=>{
 for(const p of ['index.html',article,'search/index.html']){
  const $=html(p);assert.equal($('script[src*="googletagmanager.com"]').length,0);
  assert.equal($('meta[name="google-site-verification"]').length,0);
  assert.ok(!$.html().includes('G-XXXXXXXXXX'));
 }
});
