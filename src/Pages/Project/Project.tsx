import React from 'react'
import Layout from '../../components/Layout/Layout'
import { useAuthGuard } from '../../hooks/useAuthGuard'
import { useParams } from 'react-router-dom'

const Project = () => {
    const { id } = useParams()
    useAuthGuard()

  return (
    <Layout>
        <div>Project: {id}</div>
    </Layout>
  )
}

export default Project