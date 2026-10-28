import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {createJiti} from 'jiti'
const {marketingProducts} = createJiti(import.meta.url)('../src/content/products.ts')
assert.deepEqual(marketingProducts.map(p => p.id), ['context', 'data'])
assert.equal(marketingProducts[0].actionPath, '/demo?source=product-context')
assert.equal(marketingProducts[1].actionPath, '/docs/data/quickstart/quickstart')
for (const path of ['src/pages/Home.tsx', 'src/components/Nav.tsx', 'src/components/Footer.tsx']) {
  const content = readFileSync(path, 'utf8')
  assert.doesNotMatch(content, /Try free|\/products\/architecture|\/docs\/agent|\/docs\/rl/)
}
console.log('Home boundary checked: Context commercial demo, Data self-service, two products and stable routes.')
