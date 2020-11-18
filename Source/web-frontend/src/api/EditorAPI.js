import axiosClient from "./APIUtils";

const EditorAPI = {
    compile: (params) => {
        const url ='/editor/compile';
        return axiosClient.post(url, params)
    },
    modify: (params) => {
        const url ='/editor/modify';
        console.log(params)
        return axiosClient.get(url, { params });
    },
    createProject: (params) => {
        const url ='/editor/creatproject';
        return axiosClient.post(url, params)
    },
    listProject: (params) => {
        const url ='/editor/getproject';
        return axiosClient.get(url)
    },
    getProjectById: (params) => {
        const url ='/editor/getprojectbyid';
        return axiosClient.get(url,{ params })
    },
    getHistoryByProjectId: (params) => {
        const url ='/editor/gethistory';
        return axiosClient.get(url,{ params })
    },
    downloadProject: (params) => {
        const url ='/editor/download';
        return axiosClient.get(url,{ params })
    } 
}

export default EditorAPI;