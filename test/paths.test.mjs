import { test } from 'node:test';
import assert from 'node:assert/strict';
test('mounts root-relative content assets under a Pages base without rewriting external or fragment URLs',async()=>{
 const { mountPath, rebaseHtml }=await import('../src/lib/content-paths.mjs');
 assert.equal(mountPath('/lib/diagram.js','/sarom-blog-source/'),'/sarom-blog-source/lib/diagram.js');
 assert.equal(mountPath('/sarom-blog-source/lib/diagram.js','/sarom-blog-source/'),'/sarom-blog-source/lib/diagram.js');
 assert.equal(mountPath('https://example.com/x','/sarom-blog-source/'),'https://example.com/x');
 assert.equal(mountPath('//cdn.example.com/x','/sarom-blog-source/'),'//cdn.example.com/x');
 assert.equal(mountPath('#heading','/sarom-blog-source/'),'#heading');
 assert.equal(rebaseHtml('<script src="/lib/a.js"></script><a href="/posts/">A</a><img src="https://example.com/a.png">','/sarom-blog-source/'),'<script src="/sarom-blog-source/lib/a.js"></script><a href="/sarom-blog-source/posts/">A</a><img src="https://example.com/a.png">');
});
