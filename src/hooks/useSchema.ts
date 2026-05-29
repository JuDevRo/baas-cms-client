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
          setSchema(response.data[0])
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

    const response = await axiosInstance.patch(
      `/schemes/update/${userId}/${schemeId}`,
      { structure }
    )

    setSchema(response.data)
    return response.data
  }, [userId, schemeId])

  const updateData = useCallback(async (data: Record<string, unknown>[], files?: Record<string, File[]>) => {
    if (!userId || !schemeId) return

    //Si tiene archivos lo envia en form data, sino en json normal
    if (files && Object.keys(files).length > 0) {

      const formData = new FormData()
      formData.append('data', JSON.stringify(data))
      for (const [key, fileList] of Object.entries(files)) {
        for (const file of fileList) {
          formData.append(key, file)
        }
      }
      const response = await axiosInstance.patch(
        `/schemes/update/${userId}/${schemeId}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )

    console.log(response.data, 'UPLOAD FIELDS response')
      setSchema(response.data)
      return response.data
    }

    const response = await axiosInstance.patch(
      `/schemes/update/${userId}/${schemeId}`,
      { data }
    )

    console.log(response.data, 'UPLOAD FIELDS response')
    setSchema(response.data)
    return response.data
  }, [userId, schemeId])

  return {
    schema,
    loading,
    error,
    updateSchema,
    updateData,
    setSchema
  }
}
