import { instance } from "@/lib/axios";

// ✅ INTERFACE para los permisos
export interface PermisoRol {
  permiso_id: number;
  permiso_nombre: string;
  permiso_descripcion: string;
  tiene_permiso: number; // 0 o 1
  puede_editar: number; // 0 o 1
}

// ✅ INTERFACE para la respuesta
export interface PermisosRolResponse {
  data: PermisoRol[];
  total?: number;
  mensaje?: string;
}

// ----------------------
// Listar permisos de un rol
// ----------------------

export const fetchPermisosRol = async (rol_id: number, usuarioId: number) => {
  try {
    const response = await instance.post(`/rol/${rol_id}`, {
      usuarioId: usuarioId // ✅ ENVIAR EN BODY
    });

    const { data, success, mensaje } = response.data;
    return { data, mensaje };
  } catch (error) {
    console.error("Error al obtener los permisos del rol:", error);
    throw error;
  }
};


export const guardarPermisosRol = async (
  rol_id: number, 
  permisos: number[], 
  usuarioId: number
) => {
  try {
    const response = await instance.post('/rol/permisos/guardar', {
      rol_id,
      permisos,
      usuarioId // ✅ ENVIAR EN BODY
    });

    const { success, mensaje } = response.data;
    return { success, mensaje };
  } catch (error) {
    console.error("Error al guardar los permisos:", error);
    throw error;
  }
};
// ----------------------
// Obtener todos los roles (para el selector)
// ----------------------
export const fetchTodosRoles = async (usuarioId: number) => {
  try {
    const response = await instance.get<{
      data: any[];
      success: boolean;
    }>(`/roles?usuarioId=${usuarioId}`);

    const { data, success } = response.data;

    console.log("Roles obtenidos:", { 
      cantidad_roles: data.length,
      success 
    });

    return { data, success };
  } catch (error) {
    console.error("Error al obtener los roles:", error);
    throw error;
  }
};