import type { SetUserAction } from "../types/user";

const initialState = {
    user: {},
};
  
const user = (state = initialState, action: SetUserAction) => {
    switch (action.type) {
      case "SET_USER":
        return { ...state, user: action.payload };
      default:
        return state;
    }
};
  
export default user;