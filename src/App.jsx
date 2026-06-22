import { useRouter } from './router'
import Home from './pages/Home'
import UseCases from './pages/UseCases'
import Benchmarks from './pages/Benchmarks'
import Docs from './pages/Docs'

export default function App() {
  const { path } = useRouter()

  if (path.startsWith('/use-cases')) return <UseCases />
  if (path.startsWith('/benchmarks')) return <Benchmarks />
  if (path.startsWith('/docs')) return <Docs />
  return <Home />
}
