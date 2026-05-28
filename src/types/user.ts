export interface UserPayload {
  _id: string
  email: string
  name: string
  role: string
  createdAt?: string
    updatedAt?: string
}

export interface SetUserAction {
  type: "SET_USER"
  payload: UserPayload
}