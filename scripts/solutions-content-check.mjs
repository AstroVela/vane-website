import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const data=readFileSync('src/content/solutions.ts','utf8'),page=readFileSync('src/pages/UseCases.tsx','utf8'),detail=readFileSync('src/pages/SolutionDetail.tsx','utf8')
for(const id of ['video-research','audio-evidence','product-verification','training'])assert.ok(data.includes("id: '"+id+"'"),'Missing scenario '+id)
assert.match(page,/setProduct/)
assert.match(page,/s\.product===product/)
assert.match(detail,/HeroShowcase/)
assert.match(detail,/\/demo\?source=solution&scenario=/)
assert.match(detail,/initialResult=\{solution\.id==='audio-evidence'/)
assert.doesNotMatch(detail,/vaneSourceFileUrl|Try free|Upload your file/)
console.log('Solutions checked: 3 Context scenarios, Data training, product filters and commercial demo links.')
