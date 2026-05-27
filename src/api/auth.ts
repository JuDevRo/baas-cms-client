import axiosInstance from './axios'

export interface LoginCredentials {
  email: string
  password: string
}

export async function login(credentials: LoginCredentials) {
    try {
        const res = await axiosInstance.post('/auth/login', credentials)
        console.log(res, 'login response')
        return res.data.user
    } catch (e) {
        console.log(e, 'login error')
        throw e
    }
//   const token = res.data?.token
//   if (token) setAuthToken(token)
}

export async function isAuthenticated() {
    return true
//   try {
//     await axiosInstance.get('/auth/me')
//     return true
//   } catch (e) {
//     console.log(e, 'error checking auth')
//     return false
//   }
}
