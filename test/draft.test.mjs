import { test } from 'node:test';
import assert from 'node:assert/strict';
const check = async options => (await import('../src/lib/content-visibility.mjs')).isDraftVisible(options);
test('draft preview is possible only for explicit local development', async () => {
 assert.equal(await check({draft:true,development:true,previewDrafts:'true'}),true);
 assert.equal(await check({draft:true,development:false,previewDrafts:'true'}),false);
 assert.equal(await check({draft:true,development:true}),false);
 assert.equal(await check({draft:false,development:false}),true);
});
