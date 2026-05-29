import { useState, useEffect } from 'react'
import Layout from '../../components/Layout/Layout'
import { useAuthGuard } from '../../hooks/useAuthGuard'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useGetProject } from '../../hooks/useProjects'
import { useGetSchema } from '../../hooks/useSchema'
import Modal from '../../components/Modal/Modal'
import { useModal } from '../../hooks/useModal'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import type { UserPayload } from '../../types/user'
import type { SchemaField } from '../../types/schema'
import './Project.css'

type Tab = 'schema' | 'entries'

const FIELD_TYPES = ['text', 'number', 'image', 'date', 'boolean', 'email', 'url']

const emptyField = (): SchemaField => ({
  key: '',
  label: '',
  type: 'text',
  required: false,
  multiple: false
})

const Project = () => {
  const { id } = useParams()
  useAuthGuard()
  const navigate = useNavigate()

  const userId = useSelector((store: { user: { user: UserPayload } }) => store.user.user._id)

  const { project, loading: projectLoading } = useGetProject(id)
  const { schema, loading: schemaLoading, updateSchema } = useGetSchema(userId, id)

  const [activeTab, setActiveTab] = useState<Tab>('schema')
  const addFieldModal = useModal()

  const [localFields, setLocalFields] = useState<SchemaField[]>([])
  const [newField, setNewField] = useState<SchemaField>(emptyField())
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    console.log(localFields, 'local fields')
  }, [localFields])


  const openAddFieldModal = () => {
    setLocalFields(schema?.structure ? [...schema.structure] : [])
    setNewField(emptyField())
    addFieldModal.open()
  }

  const handleAddField = () => {
    if (!newField.key || !newField.label) return
    setLocalFields(prev => [...prev, { ...newField }])
    setNewField(emptyField())
  }

  const handleRemoveField = (index: number) => {
    setLocalFields(prev => prev.filter((_, i) => i !== index))
  }

  const handleSaveSchema = async () => {
    try {
      setSaving(true)
      await updateSchema(localFields)
      addFieldModal.close()
    } catch {
      console.error('Failed to save schema')
    } finally {
      setSaving(false)
    }
  }

  if (projectLoading) {
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

  const structure = schema?.structure ?? []

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
            <>
              <div className="project-section-header">
                <h3>Fields</h3>
                <button className="project-add-btn" onClick={openAddFieldModal}>
                  <Plus size={16} />
                  Add Fields
                </button>
              </div>

              {schemaLoading ? (
                <p className="project-empty">Loading schema...</p>
              ) : structure.length === 0 ? (
                <p className="project-empty">No fields yet. Add your first field to define the schema.</p>
              ) : (
                <div className="project-field-list">
                  {structure.map((field, index) => (
                    <div key={field.key + index} className="project-field-card">
                      <div className="project-field-info">
                        <span className="project-field-label">{field.label}</span>
                        <span className="project-field-key">{field.key}</span>
                        <span className="project-field-type">{field.type}</span>
                        {field.required && <span className="project-field-badge">required</span>}
                        {field.multiple && <span className="project-field-badge">multiple</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'entries' && (
            <div className="project-section-header">
              <h3>Content Entries</h3>
              <button className="project-add-btn">
                <Plus size={16} />
                Add Entry
              </button>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={addFieldModal.isOpen} onClose={addFieldModal.close} title="Schema Fields">
        <div className="schema-modal">
          {localFields.length > 0 && (
            <div className="schema-modal-fields">
              <label className="modal-form-label">Current Fields</label>
              {localFields.map((field, index) => (
                <div key={index} className="schema-field-row">
                  <div className="schema-field-row-info">
                    <span className="schema-field-row-label">{field.label}</span>
                    <span className="schema-field-row-key">{field.key}</span>
                    <span className="schema-field-row-type">{field.type}</span>
                    {field.required && <span className="project-field-badge">required</span>}
                    {field.multiple && <span className="project-field-badge">multiple</span>}
                  </div>
                  <button className="schema-field-remove" onClick={() => handleRemoveField(index)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="schema-modal-add">
            <label className="modal-form-label">Add New Field</label>
            <div className="schema-modal-form">
              <input
                className="modal-form-input"
                type="text"
                placeholder="Key (e.g. title)"
                value={newField.key}
                onChange={e => setNewField(prev => ({ ...prev, key: e.target.value }))}
              />
              <input
                className="modal-form-input"
                type="text"
                placeholder="Label (e.g. Título)"
                value={newField.label}
                onChange={e => setNewField(prev => ({ ...prev, label: e.target.value }))}
              />
              <select
                className="modal-form-input"
                value={newField.type}
                onChange={e => setNewField(prev => ({ ...prev, type: e.target.value }))}
              >
                {FIELD_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <div className="schema-modal-checkboxes">
                <label className="schema-modal-checkbox">
                  <input
                    type="checkbox"
                    checked={newField.required ?? false}
                    onChange={e => setNewField(prev => ({ ...prev, required: e.target.checked }))}
                  />
                  Required
                </label>
                <label className="schema-modal-checkbox">
                  <input
                    type="checkbox"
                    checked={newField.multiple ?? false}
                    onChange={e => setNewField(prev => ({ ...prev, multiple: e.target.checked }))}
                  />
                  Multiple
                </label>
              </div>
              <button
                className="schema-modal-add-btn"
                onClick={handleAddField}
                disabled={!newField.key || !newField.label}
              >
                <Plus size={14} />
                Add
              </button>
            </div>
          </div>

          <div className="modal-form-actions">
            <button className="modal-form-btn modal-form-btn-secondary" onClick={addFieldModal.close}>Cancel</button>
            <button
              className="modal-form-btn modal-form-btn-primary"
              onClick={handleSaveSchema}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  )
}

export default Project
