import axios from "axios";

// ✅ Configuración para ambos entornos (desarrollo y producción)
export const instance = axios.create({
    baseURL: import.meta.env.MODE === 'development' 
        ? "http://localhost:3005/api/servicio"  // Desarrollo
        : "https://backen-inforsystems-servicio-tecnico.onrender.com/api/servicio", // Producción
    withCredentials: true
});