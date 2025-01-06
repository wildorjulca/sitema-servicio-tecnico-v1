
import { login } from "@/apis"


export const authenticateUser = async (usuario: string, password: string) => {
    try {
        const userData = await login(usuario, password)
        return userData

    } catch (error) {
        console.log(error)
    }

}