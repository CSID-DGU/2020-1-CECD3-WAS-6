import { combineReducers } from 'redux'
import user from './userReducer'

const RootReducer = combineReducers({
    user
})

export default RootReducer;