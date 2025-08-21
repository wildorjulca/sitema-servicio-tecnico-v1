import { useMutation } from "@tanstack/react-query";
import { login } from "@/apis";
import { AxiosError } from "axios";
import { useUser } from "@/hooks/useUser";
import { User } from "@/context/UserContext";



interface TypeResponse {
  ok: boolean;
  message: string | undefined;
  token?: string;
  title?: string;
  data?: User;
}

export const useLogin = () => {
  const { setUser } = useUser();

  return useMutation<TypeResponse, AxiosError, { usuario: string; password: string }>({
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
      if (data.ok && data.token && data.data) {
        // Guardar en UserContext
        setUser(data.data, data.token);

        // Guardar en localStorage para persistencia
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.data));

        console.log("[useLogin] UserContext actualizado:", data.data);
      }
    },
    onError: (error) => {
      console.error("[useLogin] Login error:", error.response?.data || error.message);
    },
  });
};
