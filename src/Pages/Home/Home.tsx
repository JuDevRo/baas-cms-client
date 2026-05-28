import Layout from '../../components/Layout/Layout'
import { useAuthGuard } from '../../hooks/useAuthGuard'
import './Home.css'

const Home = () => {
  const { checking } = useAuthGuard()

  // if (checking) return <div>Comprobando autenticación...</div>

  return (
    <Layout>
      <div>
        {
          checking ? 'Comprobando autenticación...' : 'Usuario autenticado'
        }
      </div>
    </Layout>
  ) 
}

export default Home