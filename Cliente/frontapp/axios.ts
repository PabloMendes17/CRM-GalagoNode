import axios from "axios";

export const makeRequest = axios.create({
    baseURL:'http://192.168.0.122:8001/api/'
});