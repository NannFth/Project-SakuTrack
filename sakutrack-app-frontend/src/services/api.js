import axios from 'axios';
import { getAuth } from 'firebase/auth';

const api = axios.create({
    baseURL: 'http://13.215.250.150:3000/api',
});

api.interceptors.request.use(async (config) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;