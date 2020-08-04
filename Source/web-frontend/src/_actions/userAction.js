import {
    REGISTER_USER,
    LOGIN_USER,
    AUTH_USER,
    LOGOUT_USER
} from './types'
import userAPI from '../api/UserAPI'

export async function registerUser(dataToSubmit){
    const request = await userAPI.register(dataToSubmit)
    return {
        type: REGISTER_USER,
        payload: request
    }
}

export async function loginUser(dataToSubmit){
    const request = await userAPI.loginUser(dataToSubmit)
    return {
        type: LOGIN_USER,
        payload: request
    }
}

export async function auth(){
    const request = await userAPI.auth()
    return {
        type: AUTH_USER,
        payload: request
    }
}