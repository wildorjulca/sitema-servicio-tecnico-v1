import { createContext } from "react";

export interface User {
  usuario: string;
  id: number;
  rol: string;
  nombre: string;
  apellidos: string;
  telefono: number;
  dni: number;
}

export interface UserContextType {
  user?: User;
  token?: string;
  loading: boolean;
  setUser: (user: User, token: string) => void;
  clearUser: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);
