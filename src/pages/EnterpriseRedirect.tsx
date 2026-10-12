import {Redirect} from '@docusaurus/router'
import useBaseUrl from '@docusaurus/useBaseUrl'
import Head from '@docusaurus/Head'
import {Link} from '../router'
export default function EnterpriseRedirect() {
  const to=useBaseUrl('/products/context')
  return <><Head><meta name="robots" content="noindex,follow"/><meta httpEquiv="refresh" content={`0;url=${to}`}/></Head><Link to="/products/context">Vane Context →</Link><Redirect to={to}/></>
}
