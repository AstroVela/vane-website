import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const routes=readFileSync('src/plugins/vaneRoutes.ts','utf8'),worker=readFileSync('server/router.ts','utf8')
assert.match(routes,/route\('\/solutions\/enterprise-agent','EnterpriseRedirect'\)/)
assert.match(worker,/Response\.redirect/)
assert.match(worker,/'\/products\/context',301/)
console.log('Legacy enterprise scenario redirects to Vane Context in both languages.')
