import axiosInstance from './axios'
import type { UserPayload } from '../types/user'
import store from '../reducers/store'
import setUser from '../actions/userActions'

export interface LoginCredentials {
  email: string
  password: string
}

export async function login(credentials: LoginCredentials): Promise<UserPayload> {
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

export async function isAuthenticated(): Promise<UserPayload | false> {
  try {
    const response = await axiosInstance.get('/auth/me')
    store.dispatch(setUser(response.data.user));
    return response.data.user ?? false
  } catch (e) {
    console.log(e, 'error checking auth')
    return false
  }
}
