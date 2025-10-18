import toast from "react-hot-toast";

// utils/errorHandler.ts
export const getErrorMessage = (error: any): string => {
  // Si es un error de Axios con response
  if (error.response?.data) {
    const data = error.response.data;
    
    // Prioridad de mensajes:
    if (data.error) return data.error; // "Acceso denegado: No tienes permiso..."
    if (data.mensaje) return data.mensaje; // "Error en la base de datos"
    if (data.message) return data.message; // Mensaje general
    if (typeof data === 'string') return data; // Si directamente es un string
  }
  
  // Si es un error general
  if (error.message) return error.message;
  
  return 'Error desconocido';
};

export const showErrorToast = (error: any) => {
  const errorMessage = getErrorMessage(error);
  toast.error(errorMessage);
};