import { useEffect, useState } from "react"
import axiosInstance from "../api/axios"

export const useGetProjects = (userId?: string) => {
  const [projects, setProjects] = useState<[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    if (!userId) return

    let cancelled = false

    const fetchProjects = async () => {
      try {
        setLoading(true)

        const response = await axiosInstance.get(
          `/projects/all/${userId}`
        )

        if (!cancelled) {
          setProjects(response.data)
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

    void fetchProjects()

    return () => {
      cancelled = true
    }

  }, [userId])

  return {
    projects,
    loading,
    error
  }
}