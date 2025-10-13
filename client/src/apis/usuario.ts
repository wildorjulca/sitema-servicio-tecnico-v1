import { instance } from "@/lib/axios";
import { PassThrough } from "stream";

// Definir la interfaz para los tipos de documento
export interface Users {
  id: number,
  nombre: string,
  apellidos: number,
  dni: number,
  telefono: number,
  usuario: string,
  password: PassThrough,
  rol_id: number
}
export interface Usuario {
  id?: number;
  usuarioId: number; // Usuario que realiza la acción
  nombre: string;
  apellidos: string;
  dni: number;
  telefono?: number;
  usuario: string;
  password?: string; // Opcional en actualización
  rol_id: number;
}

// ----------------------
// Listar usuarios
// ----------------------
export const fetchUsers = async (
  usuarioId: number,
  pageIndex = 0,
  pageSize = 10
) => {
  try {
    const response = await instance.get<{
      data: Users[];
      total: number;
    }>(`/getUser/${usuarioId}?pageIndex=${pageIndex}&pageSize=${pageSize}`);

    const { data, total } = response.data;

    console.log("Tipos de documento obtenidos:", { data, total });
    return { data, total };
  } catch (error) {
    console.error("Error al obtener tipos de documento:", error);
    throw error;
  }
};


// ----------------------
// Agregar usuario
// ----------------------

export const addUserAPI = async ({
  usuarioId,
  nombre,
  apellidos,
  dni,
  telefono,
  usuario,
  password,
  rol_id
}: Usuario) => {
  try {
    const response = await instance.post("/user-add", {
      usuarioId,
      nombre,
      apellidos,
      dni,
      telefono,
      usuario,
      password,
      rol_id
    });
    console.log("Usuario agregado:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al agregar usuario:", error);
    throw error;
  }
}

// ----------------------
// Actualizar usuario
// ----------------------

export const editUserAPI = async ({
  id,
  usuarioId,
  nombre,
  apellidos,
  dni,
  telefono,
  usuario,
  password,
  rol_id
}: Usuario) => {
  try {
    console.log("🔍 DEBUG editUserAPI - INICIO:");
    console.log("id recibido:", id, "tipo:", typeof id);
    console.log("usuarioId recibido:", usuarioId, "tipo:", typeof usuarioId);

    // ✅ CREAR PAYLOAD EXPLÍCITAMENTE
    const payload = {
      id: id,           // ← Asegurar que se incluya
      usuarioId: usuarioId,
      nombre,
      apellidos,
      dni,
      telefono,
      password,
      usuario,
      rol_id
    };
    
    // ✅ Solo incluir password si tiene valor
    if (password && password.trim() !== '') {
      payload.password = password;
    }
    
    console.log("📤 Payload COMPLETO para backend:", payload);
    console.log("📤 Keys del payload:", Object.keys(payload));
    
    const response = await instance.put(`/userEdit`, payload);
    
    console.log("✅ Usuario actualizado:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error al editar usuario:", error);
    throw error;
  }
}
// ----------------------
// Eliminar usuario
// ----------------------

export const deleteUserAPI = async (id: number, usuarioId: number) => {
  try {
    const response = await instance.delete(`/user-delete/${id}`, {
      data: { usuarioId }
    });
    console.log("Usuario eliminado:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    throw error;
  }
}

