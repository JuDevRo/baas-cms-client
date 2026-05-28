import { combineReducers } from "redux";
import { legacy_createStore as createStore } from "redux";
import user from "./user";


const rootReducer = combineReducers({
    user: user,
    // test: test,
    // configuration: configuration,
    // language: language,
    // theme: theme,
    // dashboard: dashboard,
    // notifications: notifications,
    // lives: lives
})

const store = createStore(rootReducer);

export default store;