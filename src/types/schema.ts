export interface SchemaField {
  key: string
  label: string
  type: string
  required?: boolean
  multiple?: boolean
}

export interface Schema {
  _id: string
  user_id: string
  projectId: string
  structure: SchemaField[]
  data: Record<string, unknown>[]
}
