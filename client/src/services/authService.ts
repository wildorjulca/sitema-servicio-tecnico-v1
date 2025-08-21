// hooks/useLogin.ts
import { useMutation } from "@tanstack/react-query";
import { login } from "@/apis";
import { AxiosError } from "axios";

interface usuario {

    id: number;
    usuario: string;
    password: string;
    nombre: string;
    dni: number;
    celular: number;
    rol: string

}
interface TypeResponse {
    ok: boolean;
    message: string | undefined;
    token?: string;
    title?: string;
    data?: usuario;
}

export const useLogin = () => {
    return useMutation<
        TypeResponse,
        AxiosError,
        { usuario: string; password: string }
    >({
        mutationFn: async ({ usuario, password }) => {
            const userData = await login(usuario, password);

            if (userData.success) {
                return {
                    ok: true,
                    message: userData.message,
                    token: userData.token,
                    data: userData.data,
                };
            }
            return { ok: false, message: userData.message };
        },
        onSuccess: (data) => {
            if (data.ok && data.token) {
                localStorage.setItem("token", data.token);
            }
        },
        onError: (error) => {
            console.error("Login error:", error.response?.data || error.message);
        },
    });
};
