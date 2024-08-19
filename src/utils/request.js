import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 20000,
});

instance.interceptors.request.use((config) => {
    //TODO: handle token
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers.Authorization = `${token}`;
    }
    return config;
});

instance.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error.response?.status === 403) {
            window.location.href = '/403';
        }
        else if (error.response?.status === 401) {
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            localStorage.clear();
            window.location.href = '/login';
        }
        else if (error.response?.status === 500) {
            window.location.href = '/500';
        }
        switch (error.response?.status) {
            case 401:
                const message401 = error.response.data.error;
                return Promise.reject(message401);
            case 400:
                const message400 = error.response.data.fail || error.response.data;
                return Promise.reject(message400);
            default:
                return Promise.reject(error.response?.data || error.message);
        }
    }
);

export default instance;
