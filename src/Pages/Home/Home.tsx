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
import Popover from '../../components/Popover/Popover'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'

interface Project {
  _id: string
  name: string
  description?: string
}

const Home = () => {
  useAuthGuard()
  const navigate = useNavigate()

  const userId = useSelector((store: { user: { user: UserPayload } }) => store.user.user._id)

  const { projects, loading, error } = useGetProjects(userId)
  const createModal = useModal()
  const editModal = useModal()
  const deleteModal = useModal()

  const [searchQuery, setSearchQuery] = useState('')
  const [activePopover, setActivePopover] = useState<string | null>(null)

  const [formName, setFormName] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deletingProject, setDeletingProject] = useState<Project | null>(null)

  const filteredProjects = projects.filter((p: Project) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const goToProject = (projectId: string) => {
    navigate(`/project/${projectId}`)
  }

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('create', { name: formName, description: formDescription })
    setFormName('')
    setFormDescription('')
    createModal.close()
  }

  const openEditModal = (project: Project) => {
    setEditingProject(project)
    setFormName(project.name)
    setFormDescription(project.description ?? '')
    setActivePopover(null)
    editModal.open()
  }

  const handleEditProject = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('edit', { id: editingProject?._id, name: formName, description: formDescription })
    editModal.close()
  }

  const openDeleteModal = (project: Project) => {
    setDeletingProject(project)
    setActivePopover(null)
    deleteModal.open()
  }

  const handleDeleteProject = () => {
    console.log('delete', deletingProject?._id)
    deleteModal.close()
  }

  return (
    <Layout>
      <div className="home-header">
        <h2>Proyectos</h2>
        <button className="home-add-btn" onClick={createModal.open}>+ Add Project</button>
      </div>

      <div className="home-project-list">
        {
          projects.length === 0 ? (
            <p>No projects found</p>
          ) : (
            projects.map((project: Project) => (
              <div key={project._id} className="home-project-card">
                <div className="home-project-card-body" onClick={() => goToProject(project._id)}>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                </div>
                <Popover
                  isOpen={activePopover === project._id}
                  onClose={() => setActivePopover(null)}
                  trigger={
                    <button
                      className="home-project-menu-btn"
                      onClick={(e) => { e.stopPropagation(); setActivePopover(prev => prev === project._id ? null : project._id) }}
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  }
                >
                  <button className="popover-item" onClick={() => openEditModal(project)}>
                    <Pencil size={14} /> Edit
                  </button>
                  <button className="popover-item popover-item--danger" onClick={() => openDeleteModal(project)}>
                    <Trash2 size={14} /> Delete
                  </button>
                </Popover>
              </div>
            ))
          )
        }
      </div>

      <Modal isOpen={createModal.isOpen} onClose={createModal.close} title="Create Project">
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
            <button type="button" className="modal-form-btn modal-form-btn-secondary" onClick={createModal.close}>Cancel</button>
            <button type="submit" className="modal-form-btn modal-form-btn-primary">Create</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={editModal.isOpen} onClose={editModal.close} title="Edit Project">
        <form className="modal-form" onSubmit={handleEditProject}>
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
            <button type="button" className="modal-form-btn modal-form-btn-secondary" onClick={editModal.close}>Cancel</button>
            <button type="submit" className="modal-form-btn modal-form-btn-primary">Save</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.close} title="Delete Project">
        <p className="modal-delete-text">
          Are you sure you want to delete <strong>{deletingProject?.name}</strong>? This action cannot be undone and all entries will be permanently deleted.
        </p>
        <div className="modal-form-actions">
          <button type="button" className="modal-form-btn modal-form-btn-secondary" onClick={deleteModal.close}>Cancel</button>
          <button type="button" className="modal-form-btn modal-form-btn-danger" onClick={handleDeleteProject}>Delete</button>
        </div>
      </Modal>
    </Layout>
  )
}

export default Home