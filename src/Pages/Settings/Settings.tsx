import React from 'react'
import Layout from '../../components/Layout/Layout'
import { useAuthGuard } from '../../hooks/useAuthGuard'

const Settings = () => {
  const { checking } = useAuthGuard()
  return (
    <Layout>
      <div>
        {
          checking ? 'Comprobando autenticación...' : 'Settings'
        }
      </div>
    </Layout>
  )
}

export default Settings