import type { SetUserAction, UserPayload } from "../types/user"

const setUser = (payload: UserPayload): SetUserAction => ({
    type: "SET_USER",
    payload
})

export default setUser