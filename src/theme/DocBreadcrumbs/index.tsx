import {useSidebarBreadcrumbs} from '@docusaurus/plugin-content-docs/client'
import { PRODUCTS } from '../../docs/products'

type BreadcrumbItem = {
  label: string
}

export default function DocBreadcrumbs() {
  const breadcrumbs = useSidebarBreadcrumbs() as BreadcrumbItem[] | null
  const group = breadcrumbs && breadcrumbs.length > 1 ? breadcrumbs[0]?.label : undefined

  return (
    <div className="crumb">
      {PRODUCTS.data.name}
      {group && <> / {group}</>}
    </div>
  )
}
