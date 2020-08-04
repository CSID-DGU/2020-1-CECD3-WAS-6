import axiosClient from "./APIUtils"

const userAPI = {
    register: (params) => {
        const url = '/users/register'
        return axiosClient.post(url, params)
    },
    loginUser: (params) => {
        const url = '/users/login'
        return axiosClient.post(url, params)
    },
    logOutUser: (params) => {
        const url = '/users/logout'
        return axiosClient.get(url)
    },
    auth: (params) => {
        const url = '/users/auth'
        return axiosClient.get(url);
    }
}

export default userAPI;