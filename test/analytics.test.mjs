import { test } from 'node:test';
import assert from 'node:assert/strict';
const resolve=async options=>(await import('../src/lib/analytics.mjs')).resolveAnalytics(options);
test('analytics stays off for local and preview builds, even when an ID is supplied',async()=>{
 assert.equal(await resolve({environment:'preview',enabled:'true',measurementId:'G-TEST123456'}),null);
 assert.equal(await resolve({environment:'production',enabled:'false',measurementId:'G-TEST123456'}),null);
 assert.equal(await resolve({}),null);
});
test('analytics requires an explicit production opt-in and validates its public ID',async()=>{
 assert.equal(await resolve({environment:'production',enabled:'true',measurementId:'G-TEST123456'}),'G-TEST123456');
 await assert.rejects(()=>resolve({environment:'production',enabled:'true',measurementId:'invalid'}),/GA4/);
 await assert.rejects(()=>resolve({environment:'production',enabled:'true'}),/GA4/);
});
