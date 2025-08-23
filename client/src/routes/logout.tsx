import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";

export const useLogout = () => {
  const { clearUser } = useUser();
  const navigate = useNavigate();

  const logout = () => {
    try {
      // Limpiar UserContext y localStorage
      clearUser();
      // Asegurarnos de que localStorage esté limpio
      localStorage.clear(); // Más agresivo para eliminar todo
      console.log("[useLogout] Sesión cerrada, localStorage limpio:", localStorage.getItem("user"), localStorage.getItem("token"));
      // Redirigir a la página de login
      navigate("/login");
    } catch (error) {
      console.error("[useLogout] Error al cerrar sesión:", error);
    }
  };

  return logout;
};
