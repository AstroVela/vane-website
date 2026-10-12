import {test} from 'node:test'
import assert from 'node:assert/strict'
import {createJiti} from 'jiti'
const load=createJiti(import.meta.url)
const {validateDemo,demoBusinessIdentity}=load('../src/demoContract.ts')
const {handleDemoRequest,notifyDue,maintainDemoRequests}=load('../server/demoRequests.ts')
const worker=load('../server/router.ts').default
const {SQLiteDemoDatabase}=load('../server/sqlite.ts')
class SQLite extends SQLiteDemoDatabase {
  constructor(){super(':memory:');this.db=this.connection}
  count(){return this.db.prepare('SELECT COUNT(*) AS n FROM demo_requests').get().n}
}
const payload={name:'Test Visitor',email:'visitor@example.com',company:'Example team',need:'Find source clips for a product.',modalities:['video','pdf'],notes:'',locale:'en',source:'home',scenario:'usage-demo'}
const request=(key=crypto.randomUUID(),value=payload,headers={})=>new Request('https://vane.example/api/demo-requests',{method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':key,'X-Vane-Client-IP':'192.0.2.20',...headers},body:JSON.stringify(value)})
const setup=()=>{const db=new SQLite(),pending=[];return {db,env:{DEMO_DB:db,DEMO_MODE:'local',ASSETS:{fetch:async()=>new Response('asset')}},ctx:{waitUntil:p=>pending.push(p)},pending}}
test('client and server share bounded normalized fields and a stable business identity',()=>{
  const a=validateDemo({...payload,name:' Test Visitor ',email:'VISITOR@EXAMPLE.COM',modalities:['pdf','video','video'],source:'unknown'})
  assert.ok(a.payload);assert.equal(a.payload.source,'direct');assert.equal(a.payload.email,'visitor@example.com')
  assert.equal(demoBusinessIdentity(a.payload),demoBusinessIdentity({...payload,modalities:['pdf','video']}))
  for(const [field,max] of [['name',80],['email',254],['company',160],['need',2000],['notes',1000]])assert.ok(validateDemo({...payload,[field]:'x'.repeat(max+1)}).fieldErrors[field])
  assert.equal(validateDemo({...payload,email:'<bad>@example.com'}).fieldErrors.email,'invalid')
  assert.equal(validateDemo({...payload,modalities:['unknown']}).fieldErrors.modalities,'invalid')
})
test('successful request is durable; concurrent retries produce exactly one receipt',async()=>{
  const {db,env,ctx,pending}=setup(),key=crypto.randomUUID()
  const replies=await Promise.all(Array.from({length:5},()=>handleDemoRequest(request(key),env,ctx)))
  const bodies=await Promise.all(replies.map(r=>r.json()))
  assert.equal(db.count(),1);assert.equal(new Set(bodies.map(b=>b.request_id)).size,1);assert.ok(replies.every(r=>r.ok))
  const conflict=await handleDemoRequest(request(key,{...payload,need:'Different request'}),env,ctx)
  assert.equal(conflict.status,409);assert.equal(db.count(),1)
  await Promise.all(pending)
})
test('request validation, origin and body limits reject without storing personal data',async()=>{
  const {db,env,ctx}=setup()
  assert.equal((await handleDemoRequest(request(undefined,{}),env,ctx)).status,400)
  assert.equal((await handleDemoRequest(request(undefined,payload,{Origin:'https://other.example'}),env,ctx)).status,403)
  assert.equal((await handleDemoRequest(request(undefined,payload,{'Content-Type':'text/plain'}),env,ctx)).status,415)
  assert.equal((await handleDemoRequest(request(undefined,payload,{'Idempotency-Key':'bad'}),env,ctx)).status,400)
  assert.equal((await handleDemoRequest(request(undefined,{...payload,notes:'x'.repeat(17000)}),env,ctx)).status,413)
  assert.equal(db.count(),0)
})
test('new submissions are rate limited; an existing idempotent request remains readable',async()=>{
  const {db,env,ctx}=setup(),key=crypto.randomUUID()
  for(let i=0;i<10;i++)assert.ok((await handleDemoRequest(request(i===0?key:undefined),env,ctx)).ok)
  assert.equal((await handleDemoRequest(request(),env,ctx)).status,429)
  assert.equal((await handleDemoRequest(request(key),env,ctx)).status,200)
  assert.equal(db.count(),10)
  const raw=db.db.prepare('SELECT * FROM demo_rate_limits').get()
  assert.equal(raw.ip_hash.includes('192.0.2.20'),false)
})
test('unconfigured or broken database cannot produce a successful receipt',async()=>{
  const {db,env,ctx}=setup()
  assert.equal((await handleDemoRequest(request(),{...env,DEMO_MODE:'production'},ctx)).status,503)
  db.db.exec('DROP TABLE demo_requests')
  assert.equal((await handleDemoRequest(request(),env,ctx)).status,503)
  const status=await worker.fetch(new Request('https://vane.example/api/demo-status'),env,ctx)
  assert.equal((await status.json()).available,false)
})
test('notification retry is independent from receipt and guarded against concurrent senders',async()=>{
  const {db,env,ctx}=setup()
  const receipt=await (await handleDemoRequest(request(),env,ctx)).json()
  const configured={...env,DEMO_MODE:'production',RESEND_API_KEY:'test-key',DEMO_FROM:'sender@example.com'}
  let sends=0,idempotency
  const failure=async(_url,init)=>{sends++;idempotency=init.headers['Idempotency-Key'];return new Response('',{status:503})}
  await Promise.all([notifyDue(configured,receipt.request_id,failure),notifyDue(configured,receipt.request_id,failure)])
  assert.equal(sends,1);assert.equal(db.count(),1)
  let row=db.db.prepare('SELECT * FROM demo_requests').get()
  assert.equal(row.attempts,1);assert.equal(row.notified_at,null);assert.equal(row.last_error_code,'provider_http_503')
  assert.ok(row.next_attempt_at>Date.now())
  db.db.exec('UPDATE demo_requests SET next_attempt_at=0')
  await notifyDue(configured,receipt.request_id,async(_url,init)=>{assert.equal(init.headers['Idempotency-Key'],idempotency);sends++;return new Response('{}',{status:200})})
  row=db.db.prepare('SELECT * FROM demo_requests').get();assert.ok(row.notified_at);assert.equal(row.attempts,2)
  await notifyDue(configured,receipt.request_id,async()=>{throw new Error('Must not send again')})
  assert.equal(sends,2)
})
test('six failed notifications stop retrying while the original request remains durable',async()=>{
  const {db,env,ctx}=setup();await handleDemoRequest(request(),env,ctx)
  const configured={...env,DEMO_MODE:'production',RESEND_API_KEY:'test-key',DEMO_FROM:'sender@example.com'}
  let sends=0
  for(let i=0;i<7;i++){db.db.exec('UPDATE demo_requests SET next_attempt_at=0');await notifyDue(configured,undefined,async()=>{sends++;return new Response('',{status:500})})}
  assert.equal(sends,6);assert.equal(db.count(),1)
})
test('scheduled cleanup uses configured retention and removes old rate-limit hashes',async()=>{
  const {db,env,ctx}=setup();await handleDemoRequest(request(),env,ctx)
  db.db.exec('UPDATE demo_requests SET created_at=0; UPDATE demo_rate_limits SET window_start=0')
  await maintainDemoRequests({...env,DEMO_RETENTION_DAYS:'30'})
  assert.equal(db.count(),0);assert.equal(db.db.prepare('SELECT COUNT(*) AS n FROM demo_rate_limits').get().n,0)
})
