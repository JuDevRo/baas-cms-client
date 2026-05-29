import { useState, useEffect } from 'react'
import Layout from '../../components/Layout/Layout'
import { useAuthGuard } from '../../hooks/useAuthGuard'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useGetProject } from '../../hooks/useProjects'
import { useGetSchema } from '../../hooks/useSchema'
import Modal from '../../components/Modal/Modal'
import { useModal } from '../../hooks/useModal'
import { ArrowLeft, Plus, Trash2, Pencil, ImageIcon } from 'lucide-react'
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
  const { schema, loading: schemaLoading, updateSchema, updateData } = useGetSchema(userId, id)

  const [activeTab, setActiveTab] = useState<Tab>('schema')
  const addFieldModal = useModal()
  const addEntryModal = useModal()
  const editEntryModal = useModal()
  const deleteEntryModal = useModal()

  const [localFields, setLocalFields] = useState<SchemaField[]>([])
  const [newField, setNewField] = useState<SchemaField>(emptyField())
  const [saving, setSaving] = useState(false)

  const [entryForm, setEntryForm] = useState<Record<string, unknown>>({})
  const [entryFiles, setEntryFiles] = useState<Record<string, File[]>>({})
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null)

  useEffect(() => {
    console.log(localFields, 'local fields')
    console.log(schema, 'schema')
    // console.log()
  }, [localFields, schema])

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

  const structure = schema?.structure ?? []
  const data = schema?.data ?? []

  const renderFieldValue = (field: SchemaField, value: unknown) => {
    if (value == null) return <span className="entry-cell-null">—</span>

    if (field.type === 'image') {
      if (Array.isArray(value)) {
        return (
          <div className="entry-image-list">
            {(value as string[]).map((url, i) => (
              <img key={i} src={url} alt="" className="entry-image-thumb" />
            ))}
          </div>
        )
      }
      return <img src={value as string} alt="" className="entry-image-thumb" />
    }

    if (field.type === 'boolean') {
      return <span>{String(value)}</span>
    }

    return <span className="entry-cell-text">{String(value)}</span>
  }

  const initEntryForm = (existing?: Record<string, unknown>) => {
    const form: Record<string, unknown> = {}
    for (const field of structure) {
      if (existing && existing[field.key] != null) {
        form[field.key] = existing[field.key]
      } else {
        form[field.key] = field.type === 'boolean' ? false : ''
      }
    }
    return form
  }

  const closeEntryModal = () => {
    setEditingIndex(null)
    addEntryModal.close()
    editEntryModal.close()
  }

  const openAddEntryModal = () => {
    setEditingIndex(null)
    setEntryForm(initEntryForm())
    setEntryFiles({})
    addEntryModal.open()
  }

  const openEditEntryModal = (index: number) => {
    setEditingIndex(index)
    setEntryForm(initEntryForm(data[index]))
    setEntryFiles({})
    editEntryModal.open()
  }

  const handleEntryChange = (key: string, value: unknown) => {
    setEntryForm(prev => ({ ...prev, [key]: value }))
  }

  const handleFileChange = (key: string, files: FileList | null) => {
    if (!files) return
    const fileArray = Array.from(files)
    setEntryFiles(prev => ({ ...prev, [key]: fileArray }))

    const previews = fileArray.map(f => URL.createObjectURL(f))
    setEntryForm(prev => ({
      ...prev,
      [key]: structure.find(s => s.key === key)?.multiple ? previews : previews[0]
    }))
  }

  const validateEntry = (): boolean => {
    for (const field of structure) {
      if (field.required) {
        const val = entryForm[field.key]
        if (field.type === 'image') {
          const hasFile = entryFiles[field.key] && entryFiles[field.key].length > 0
          const hasUrl = typeof val === 'string' && val.length > 0
          if (!hasFile && !hasUrl) {
            alert(`"${field.label}" is required`)
            return false
          }
        } else if (field.type === 'boolean') {
          if (val !== true && val !== false) {
            alert(`"${field.label}" is required`)
            return false
          }
        } else if (!val || (typeof val === 'string' && !val.trim())) {
          alert(`"${field.label}" is required`)
          return false
        }
      }
    }
    return true
  }

  const handleSaveEntry = async () => {
    if (!validateEntry()) return

    try {
      setSaving(true)
      const newData = [...data]
      const cleanEntry: Record<string, unknown> = {}

      for (const field of structure) {
        let val = entryForm[field.key]

        if (field.type === 'image') {
          if (entryFiles[field.key] && entryFiles[field.key].length > 0) {
            val = field.multiple
              ? entryFiles[field.key].map(f => URL.createObjectURL(f))
              : URL.createObjectURL(entryFiles[field.key][0])
          }
        }

        if (field.type === 'number') {
          val = Number(val)
        }

        cleanEntry[field.key] = val
      }

      if (editingIndex != null) {
        newData[editingIndex] = cleanEntry
      } else {
        newData.push(cleanEntry)
      }

      const hasFiles = Object.keys(entryFiles).length > 0
      await updateData(newData, hasFiles ? entryFiles : undefined)
      closeEntryModal()
    } catch {
      console.error('Failed to save entry')
    } finally {
      setSaving(false)
    }
  }

  const openDeleteEntryModal = (index: number) => {
    setDeletingIndex(index)
    deleteEntryModal.open()
  }

  const handleDeleteEntry = async () => {
    if (deletingIndex == null) return
    try {
      setSaving(true)
      const newData = data.filter((_, i) => i !== deletingIndex)
      await updateData(newData)
      deleteEntryModal.close()
    } catch {
      console.error('Failed to delete entry')
    } finally {
      setSaving(false)
      setDeletingIndex(null)
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
            <>
              <div className="project-section-header">
                <h3>Content Entries</h3>
                <button
                  className="project-add-btn"
                  onClick={openAddEntryModal}
                  disabled={structure.length === 0}
                >
                  <Plus size={16} />
                  Add Entry
                </button>
              </div>

              {structure.length === 0 ? (
                <p className="project-empty">Define fields in the Schema tab first.</p>
              ) : data.length === 0 ? (
                <p className="project-empty">No entries yet. Add your first entry.</p>
              ) : (
                <div className="entry-table-wrapper">
                  <table className="entry-table">
                    <thead>
                      <tr>
                        {structure.map(field => (
                          <th key={field.key}>{field.label}</th>
                        ))}
                        <th className="entry-actions-th">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((entry, rowIndex) => (
                        <tr key={rowIndex}>
                          {structure.map(field => (
                            <td key={field.key} data-label={field.label}>
                              {renderFieldValue(field, entry[field.key])}
                            </td>
                          ))}
                          <td className="entry-actions-td" data-label="Actions">
                            <button
                              className="entry-action-btn"
                              onClick={() => openEditEntryModal(rowIndex)}
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              className="entry-action-btn entry-action-btn--danger"
                              onClick={() => openDeleteEntryModal(rowIndex)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Schema fields modal */}
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

      {/* Add/Edit entry modal */}
      <Modal
        isOpen={addEntryModal.isOpen || editEntryModal.isOpen}
        onClose={closeEntryModal}
        title={editingIndex != null ? 'Edit Entry' : 'Add Entry'}
      >
        <div className="entry-modal">
          <div className="entry-modal-fields">
            {structure.map(field => (
              <label key={field.key} className="modal-form-label">
                {field.label}
                {fieldRequiredInput(field, entryForm, entryFiles, handleEntryChange, handleFileChange)}
              </label>
            ))}
          </div>

          <div className="modal-form-actions">
            <button
              className="modal-form-btn modal-form-btn-secondary"
              onClick={closeEntryModal}
            >
              Cancel
            </button>
            <button
              className="modal-form-btn modal-form-btn-primary"
              onClick={handleSaveEntry}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete entry confirmation modal */}
      <Modal isOpen={deleteEntryModal.isOpen} onClose={deleteEntryModal.close} title="Delete Entry">
        <p className="modal-delete-text">
          Are you sure you want to delete this entry? This action cannot be undone.
        </p>
        <div className="modal-form-actions">
          <button className="modal-form-btn modal-form-btn-secondary" onClick={deleteEntryModal.close}>Cancel</button>
          <button
            className="modal-form-btn modal-form-btn-danger"
            onClick={handleDeleteEntry}
            disabled={saving}
          >
            Delete
          </button>
        </div>
      </Modal>
    </Layout>
  )
}

function fieldRequiredInput(
  field: SchemaField,
  entryForm: Record<string, unknown>,
  entryFiles: Record<string, File[]>,
  onChange: (key: string, value: unknown) => void,
  onFileChange: (key: string, files: FileList | null) => void
) {
  if (field.type === 'image') {
    const existingImages = entryForm[field.key]
    const existingUrls = existingImages
      ? Array.isArray(existingImages)
        ? existingImages as string[]
        : [existingImages as string]
      : []

    return (
      <div className="entry-image-field">
        <input
          type="file"
          accept="image/*"
          multiple={field.multiple}
          onChange={e => onFileChange(field.key, e.target.files)}
          className="entry-file-input"
          id={`file-${field.key}`}
        />
        <label htmlFor={`file-${field.key}`} className="entry-file-label">
          <ImageIcon size={16} />
          {entryFiles[field.key]?.length
            ? `${entryFiles[field.key].length} file(s) selected`
            : existingUrls.length > 0
              ? `${existingUrls.length} image(s)`
              : 'Choose images'}
        </label>
        {(existingUrls.length > 0 || entryFiles[field.key]?.length > 0) && (
          <div className="entry-image-previews">
            {existingUrls.map((url, i) => (
              <img key={`existing-${i}`} src={url} alt="" className="entry-image-preview" />
            ))}
            {entryFiles[field.key]?.map((file, i) => (
              <img key={i} src={URL.createObjectURL(file)} alt="" className="entry-image-preview" />
            ))}
          </div>
        )}
      </div>
    )
  }

  if (field.type === 'boolean') {
    return (
      <div className="entry-boolean-field">
        <label className="schema-modal-checkbox">
          <input
            type="checkbox"
            checked={!!entryForm[field.key]}
            onChange={e => onChange(field.key, e.target.checked)}
          />
        </label>
      </div>
    )
  }

  if (field.type === 'number') {
    return (
      <input
        className="modal-form-input"
        type="number"
        value={entryForm[field.key] as string ?? ''}
        onChange={e => onChange(field.key, e.target.value)}
        placeholder={field.label}
      />
    )
  }

  if (field.type === 'date') {
    return (
      <input
        className="modal-form-input"
        type="date"
        value={entryForm[field.key] as string ?? ''}
        onChange={e => onChange(field.key, e.target.value)}
      />
    )
  }

  if (field.type === 'email') {
    return (
      <input
        className="modal-form-input"
        type="email"
        value={entryForm[field.key] as string ?? ''}
        onChange={e => onChange(field.key, e.target.value)}
        placeholder="email@example.com"
      />
    )
  }

  if (field.type === 'url') {
    return (
      <input
        className="modal-form-input"
        type="url"
        value={entryForm[field.key] as string ?? ''}
        onChange={e => onChange(field.key, e.target.value)}
        placeholder="https://"
      />
    )
  }

  return (
    <input
      className="modal-form-input"
      type="text"
      value={entryForm[field.key] as string ?? ''}
      onChange={e => onChange(field.key, e.target.value)}
      placeholder={field.label}
    />
  )
}

export default Project
