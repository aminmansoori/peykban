import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

const instance = axios.create({
    //baseURL is achieved via run jsonserver project
    baseURL: 'https://pakeban-server-pakeban0.fandogh.cloud',
    // baseURL: 'http://192.168.1.109:3000',
    responseType: "json",
    validateStatus: function (status) {
        return status >= 200;
    }
});

instance.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('@token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
)
export default instance;