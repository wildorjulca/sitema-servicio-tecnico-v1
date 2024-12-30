import axios from "axios";


export const instance = axios.create({
    baseURL: "http://localhost:3005/api/servicio",
    withCredentials: true
})

