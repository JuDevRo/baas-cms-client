import { useEffect, useState } from "react"
import axiosInstance from "../api/axios"
import { useSelector } from 'react-redux'
import type { UserPayload } from '../types/user'

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

export const useGetProject = (id?: string) => {
  const [project, setProject] = useState<{ _id: string; name: string; description?: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<unknown>(null)
    const userId = useSelector((store: { user: { user: UserPayload } }) => store.user.user._id)

  useEffect(() => {
    if (!id) return
    if (!userId) return

    let cancelled = false

    const fetchProject = async () => {
      try {
        setLoading(true)

        const response = await axiosInstance.get(
          `/projects/project/${userId}/${id}`
        )

        if (!cancelled) {
          setProject(response.data)
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

    void fetchProject()

    return () => {
      cancelled = true
    }

  }, [id, userId])

  return {
    project,
    loading,
    error
  }
}
