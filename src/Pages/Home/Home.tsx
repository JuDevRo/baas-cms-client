import { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import { useAuthGuard } from '../../hooks/useAuthGuard'
import { useSelector } from 'react-redux'
import './Home.css'
import type { UserPayload } from '../../types/user'
import { useGetProjects } from '../../hooks/useProjects'
import { useNavigate } from 'react-router-dom'
import Modal from '../../components/Modal/Modal'
import { useModal } from '../../hooks/useModal'

const Home = () => {
  useAuthGuard()
  const navigate = useNavigate()

  const userId = useSelector((store: { user: { user: UserPayload } }) => store.user.user._id)

  const { projects, loading, error } = useGetProjects(userId)
  const { isOpen, open, close } = useModal()

  const [formName, setFormName] = useState('')
  const [formDescription, setFormDescription] = useState('')

  const goToProject = (projectId: string) => {
    navigate(`/project/${projectId}`)
  }

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ name: formName, description: formDescription })
    close()
  }

  return (
    <Layout>
      <div className="home-header">
        <h2>Proyectos</h2>
        <button className="home-add-btn" onClick={open}>+ Add Project</button>
      </div>

      <div className="home-project-list">
        {
          projects.length === 0 ? (
            <p>No projects found</p>
          ) : (
            projects.map((project: any) => (
              <div key={project._id} onClick={() => goToProject(project._id)} className="home-project-card">
                <h3>{project.name}</h3>
                <p>{project.description}</p>
              </div>
            ))
          ) 
        }
      </div>

      <Modal isOpen={isOpen} onClose={close} title="Create Project">
        <form className="modal-form" onSubmit={handleCreateProject}>
          <label className="modal-form-label">
            Name
            <input
              className="modal-form-input"
              type="text"
              value={formName}
              onChange={e => setFormName(e.target.value)}
              placeholder="Project name"
              required
            />
          </label>
          <label className="modal-form-label">
            Description
            <textarea
              className="modal-form-input modal-form-textarea"
              value={formDescription}
              onChange={e => setFormDescription(e.target.value)}
              placeholder="Project description"
              rows={3}
            />
          </label>
          <div className="modal-form-actions">
            <button type="button" className="modal-form-btn modal-form-btn-secondary" onClick={close}>Cancel</button>
            <button type="submit" className="modal-form-btn modal-form-btn-primary">Create</button>
          </div>
        </form>
      </Modal>
    </Layout>
  ) 
}

export default Home