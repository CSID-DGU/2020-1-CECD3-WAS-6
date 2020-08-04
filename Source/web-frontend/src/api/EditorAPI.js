import axiosClient from "./APIUtils";

const EditorAPI = {
    compile: (params) => {
        const url ='/editor/compile';
        return axiosClient.post(url, params)
    }
}

export default EditorAPI;