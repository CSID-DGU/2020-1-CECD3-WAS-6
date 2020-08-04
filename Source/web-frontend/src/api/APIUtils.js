import axios from 'axios'
import queryString from 'query-string'

// Create connect
const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_SERVER_API, 
    headers: {
        'content-type': 'application/json',
    },
    paramsSerializer: params => queryString.stringify(params)
})

axiosClient.interceptors.request.use(async (config) => {
    const token = localStorage.getItem("token")
    if(token){
        config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
}, err => {
    Promise.reject(err)
})

axiosClient.interceptors.response.use((response) => {
    if(response && response.data){
        return response.data;
    }
    return response
}, (err) => {
    throw err;
})

export default axiosClient;