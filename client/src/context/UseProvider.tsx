
import { useState, useEffect, ReactNode } from "react";
import { User, UserContext } from "./UserContext";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User>();
  const [token, setToken] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      setUserState({ ...parsedUser, usuarioId: parsedUser.id });
      setToken(storedToken);
      console.log("[UserProvider] cargado desde localStorage:", { ...parsedUser, usuarioId: parsedUser.id });
    } else {
      console.log("[UserProvider] No hay datos en localStorage");
    }
    setLoading(false);
  }, []);

  const setUser = (u: User, t: string) => {
    setUserState(u);
    setToken(t);
    localStorage.setItem("user", JSON.stringify(u));
    localStorage.setItem("token", t);
    console.log("[UserProvider] setUser llamado:", u);
  };

  const clearUser = () => {
    setUserState(undefined);
    setToken(undefined);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    console.log("[UserProvider] clearUser llamado, localStorage limpio:", localStorage.getItem("user"), localStorage.getItem("token"));
  };

  return (
    <UserContext.Provider value={{ user, token, loading, setUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};
