import { instance } from "@/lib/axios"


export const login = async (usuario: string, password: string) => {
    try {
        const response = await instance.post("/login", { usuario, password })
        return response.data

    } catch (error) {
        console.log(error)
    }

}