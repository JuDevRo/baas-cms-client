import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAuthenticated } from '../api/auth'

export function useAuthGuard(redirect = true) {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)

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
  }, [navigate, redirect])

  return { checking }
}
