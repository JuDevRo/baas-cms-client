import React from 'react'
import { useAuthGuard } from '../../hooks/useAuthGuard'
import './Home.css'

const Home = () => {
  const { checking } = useAuthGuard()

  if (checking) return <div>Comprobando autenticación...</div>

  return <div>Home (usuario autenticado)</div>
}

export default Home