
import { instance } from "@/lib/axios";

// Interfaces
export interface Equipo {
  id: number;
  nombreequipo: string;
  usuarioId: number;
}

export interface EquipoInit {
  nombreequipo: string;
  usuarioId: number;
}

// Listar equipos
export const fetchEquiposApi = async (
  usuarioId: number,
  pageIndex = 0,
  pageSize = 10
) => {
  try {
    const response = await instance.get(
      `/getEquipo/${usuarioId}?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );

    const { data, total } = response.data;

    console.log("Equipos obtenidos:", { data, total });
    return { data, total };
  } catch (error) {
    console.error("Error al obtener equipos:", error);
    throw error;
  }
};

// Agregar equipo
export const addEquiposApi = async ({ nombreequipo, usuarioId }: EquipoInit) => {
  try {
    const response = await instance.post("/addEquipo", { nombreequipo, usuarioId });
    console.log("Equipo agregado:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al agregar equipo:", error);
    throw error;
  }
};

// Actualizar equipo
export const editEquiposApi = async ({ id, nombreequipo, usuarioId }: Equipo) => {
  try {
    console.log("➡️ editEquiposApi payload:", { id, nombreequipo, usuarioId });
    const response = await instance.put(`/updateEquipo`, { id, nombreequipo, usuarioId });
    console.log("Equipo actualizado:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al editar equipo:", error);
    throw error;
  }
};

// Eliminar equipo
export const deleteEquiposApi = async (id: number, usuarioId: number) => {
  try {
    const response = await instance.delete(`/deleteEquipo/${id}`, { data: { usuarioId } });
    console.log("Equipo eliminado:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar equipo:", error);
    throw error;
  }
};




export const fetchEquipoCbo = async (
) => {
  try {
    const response = await instance.get(`/getEq`);

    const { data } = response.data;

    console.log("equipos obtenidas:", { data });
    return { data }; // Devolver tanto data como total
  } catch (error) {
    console.error("Error al obtener equipos:", error);
    throw error;
  }
};