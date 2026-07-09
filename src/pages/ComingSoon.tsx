import { Link } from '../router'
import ProductGlyph from '../docs/ProductGlyph'
import { productCapabilities, productDescription, type Product } from '../docs/products'
import { pickLocale, useSiteLocale } from '../siteI18n'

/* Coming-soon teaser shown in the content column for `soon` products
   (Vane Agent / Vane RL) in place of an empty doc tree. */
export default function ComingSoon({ product }: { product: Product }) {
  const locale = useSiteLocale()
  const copy = pickLocale(
    locale,
    {
      soon: 'Coming soon',
      planned: 'Planned capabilities',
      available: 'Vane Data is available today',
    },
    {
      soon: '即将推出',
      planned: '计划能力',
      available: 'Vane Data 现已可用',
    },
  )
  const desc = productDescription(product, locale)
  const caps = productCapabilities(product, locale) ?? []

  return (
    <div className="soon">
      <div className="soon-eyebrow">{copy.soon}</div>

      <div className="soon-head">
        <span className="soon-tile">
          <ProductGlyph id={product.id} size={24} />
        </span>
        <h1 className="dh">{product.name}</h1>
      </div>

      <p className="soon-desc">{desc}</p>

      <div className="soon-caps-eyebrow">{copy.planned}</div>
      <div className="soon-caps">
        {caps.map((cap) => (
          <div className="soon-cap" key={cap}>
            <span className="bullet" />
            <span>{cap}</span>
          </div>
        ))}
      </div>

      <div className="soon-foot">
        <Link to="/docs/data">
          {copy.available} <span className="ar">→</span>
        </Link>
      </div>
    </div>
  )
}
