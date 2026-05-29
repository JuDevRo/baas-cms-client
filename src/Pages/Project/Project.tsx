import { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { useAuthGuard } from '../../hooks/useAuthGuard'
import { useParams, useNavigate } from 'react-router-dom'
import { useGetProject } from '../../hooks/useProjects'
import { ArrowLeft } from 'lucide-react'
import './Project.css'

type Tab = 'schema' | 'entries'

const Project = () => {
  const { id } = useParams()
  useAuthGuard()
  const navigate = useNavigate()
  
  const { project, loading } = useGetProject(id)

  const [activeTab, setActiveTab] = useState<Tab>('schema')

  if (loading) {
    return (
      <Layout>
        <p className="project-loading">Loading...</p>
      </Layout>
    )
  }

  if (!project) {
    return (
      <Layout>
        <p className="project-loading">Project not found</p>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="project">
        <button className="project-back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="project-header">
          <h1 className="project-title">{project.name}</h1>
          {project.description && (
            <p className="project-description">{project.description}</p>
          )}
        </div>

        <div className="project-tabs" role="tablist">
          <button
            className={`project-tab ${activeTab === 'schema' ? 'project-tab--active' : ''}`}
            onClick={() => setActiveTab('schema')}
            role="tab"
            aria-selected={activeTab === 'schema'}
          >
            Schema
          </button>
          <button
            className={`project-tab ${activeTab === 'entries' ? 'project-tab--active' : ''}`}
            onClick={() => setActiveTab('entries')}
            role="tab"
            aria-selected={activeTab === 'entries'}
          >
            Entries
          </button>
        </div>

        <div className="project-tab-content" role="tabpanel">
          {activeTab === 'schema' && (
            <div className="project-section-header">
              <h3>Fields</h3>
              <button className="project-add-btn">Add Fields</button>
            </div>
          )}
          {activeTab === 'entries' && (
            <div className="project-section-header">
              <h3>Content Entries</h3>
              <button className="project-add-btn">Add Entry</button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Project
