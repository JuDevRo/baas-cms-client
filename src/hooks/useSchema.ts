import { useEffect, useState, useCallback } from "react"
import axiosInstance from "../api/axios"
import type { Schema, SchemaField } from "../types/schema"

export const useGetSchema = (userId?: string, projectId?: string) => {
  const [schema, setSchema] = useState<Schema | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<unknown>(null)
  const [schemeId, setSchemeId] = useState<string>('')

  useEffect(() => {
    if (!userId || !projectId) return

    let cancelled = false

    const fetchSchema = async () => {
      try {
        setLoading(true)

        const response = await axiosInstance.get(
          `/schemes/scheme/${userId}/${projectId}`
        )

        if (!cancelled) {
          console.log(response.data, 'fetched schema')
          setSchema(response.data)
          setSchemeId(response.data[0]._id)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void fetchSchema()

    return () => {
      cancelled = true
    }
  }, [userId, projectId])

  const updateSchema = useCallback(async (structure: SchemaField[]) => {
    if (!userId || !schemeId) return
    console.log(structure, 'structure')
    console.log(`${userId}/${schemeId}`, 'path')
    const response = await axiosInstance.patch(
      `/schemes/update/${userId}/${schemeId}`,
      { structure }
    )

    setSchema(response.data)
    return response.data
  }, [userId, schemeId])

  return {
    schema,
    loading,
    error,
    updateSchema,
    setSchema
  }
}
