import {useSidebarBreadcrumbs} from '@docusaurus/plugin-content-docs/client'
import { PRODUCTS } from '../../docs/products'

type BreadcrumbItem = {
  label: string
}

export default function DocBreadcrumbs() {
  const breadcrumbs = useSidebarBreadcrumbs() as BreadcrumbItem[] | null
  const product = PRODUCTS.data
  const group = breadcrumbs && breadcrumbs.length > 1 ? breadcrumbs[0]?.label : undefined

  return (
    <div className="crumb">
      {product.name}
      {group && <> / {group}</>}
    </div>
  )
}
