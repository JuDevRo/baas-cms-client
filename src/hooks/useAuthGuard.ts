import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAuthenticated } from '../api/auth'
import { useDispatch } from 'react-redux'

export function useAuthGuard(redirect = true) {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    let mounted = true

    isAuthenticated().then((ok) => {
      if (!mounted) return
      setChecking(false)
      if (!ok && redirect) navigate('/login')
    })

    return () => {
      mounted = false
    }
  }, [dispatch, navigate, redirect])

  return { checking }
}
