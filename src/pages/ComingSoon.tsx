import { Link } from '../router'
import ProductGlyph from '../docs/ProductGlyph'
import type { Product } from '../docs/products'

/* Coming-soon teaser shown in the content column for `soon` products
   (Vane Agent / Vane RL) in place of an empty doc tree. */
export default function ComingSoon({ product }: { product: Product }) {
  return (
    <div className="soon">
      <div className="soon-eyebrow">Coming soon</div>

      <div className="soon-head">
        <span className="soon-tile">
          <ProductGlyph id={product.id} size={24} />
        </span>
        <h1 className="dh">{product.name}</h1>
      </div>

      <p className="soon-desc">{product.desc}</p>

      <div className="soon-caps-eyebrow">Planned capabilities</div>
      <div className="soon-caps">
        {(product.caps ?? []).map((cap) => (
          <div className="soon-cap" key={cap}>
            <span className="bullet" />
            <span>{cap}</span>
          </div>
        ))}
      </div>

      <div className="soon-foot">
        <Link to="/docs/data">
          Vane Data is available today <span className="ar">→</span>
        </Link>
      </div>
    </div>
  )
}
