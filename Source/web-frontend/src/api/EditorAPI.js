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
    }
}

export default EditorAPI;