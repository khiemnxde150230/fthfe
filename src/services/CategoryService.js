import request from '../utils/request';

export const getCategoriesService = async (data) => {
    try {
        const response = await request({
            method: "get",
            url: "category",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(data),
        });
        return response;
    } catch (e) {
        throw e;
    }
}

export const searchCategoriesService = async (name) => {
    try {
        const response = await request({
            method: "get",
            url: `category?name=${name}`,
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response;
    } catch (e) {
        throw e;
    }
}

export const addCategoryService = async (data) => {
    try {
        const response = await request({
            method: "post",
            url: "category",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(data),
        });
        return response;
    } catch (e) {
        throw e;
    }
}

export const updateCategoryService = async (id, data) => {
    try {
        const response = await request({
            method: "put",
            url: `category/${id}`,
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(data),
        });
        return response;
    } catch (e) {
        throw e;
    }
}

export const deleteCategoryService = async (id) => {
    try {
        const response = await request({
            method: "delete",
            url: `category/${id}`,
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response;
    } catch (e) {
        throw e;
    }
}