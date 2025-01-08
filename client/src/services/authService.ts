
import { login } from "@/apis"

const BugFunction = (error: any) => {
    if (error.status === 401) {  // msg => usuario no econtrado
        return { ok: false, message: "Incorrect credentials!" }
    }

}

interface TypeErrror {
    ok: boolean,
    message: string | undefined
}
export const authenticateUser = async (usuario: string, password: string): Promise<TypeErrror | undefined> => {
    try {
        const userData = await login(usuario, password)
        if (userData.status == 200) return userData

    } catch (error) {
        return BugFunction(error)
    }

}