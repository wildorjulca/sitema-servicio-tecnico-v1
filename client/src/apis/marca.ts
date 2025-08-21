import { instance } from "@/lib/axios"


// Interfaces
export interface Brand {
  id?: number
  nombre: string
  usuarioId: number
}

export interface BrandInit {
  nombre: string
  usuarioId: number
}

// ----------------------
// Listar marcas
// ----------------------
export const fetchBrands = async (usuarioId: number) => {
  try {
    const response = await instance.get(`/getAll/${usuarioId}`);
    const { data } = response.data;

    console.log("Marcas obtenidas:", data);
    return { data };
  } catch (error) {
    console.error("Error al obtener marcas:", error);
    throw error;
  }
}

// ----------------------
// Agregar marca
// ----------------------
export const addBrandAPI = async ({ nombre, usuarioId }: BrandInit) => {
  try {
    const response = await instance.post("/addMarca", { nombre, usuarioId });
    console.log("Marca agregada:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al agregar marca:", error);
    throw error;
  }
}

// ----------------------
// Actualizar marca
// ----------------------
export const editBrandAPI = async ({ id, nombre, usuarioId }: Brand) => {
  try {
    const response = await instance.put(`/updateMarca`, { id, nombre, usuarioId });
    console.log("Marca actualizada:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al editar marca:", error);
    throw error;
  }
}

// ----------------------
// Eliminar marca
// ----------------------
export const deleteBrandAPI = async (id: number, usuarioId: number) => {
  try {
    const response = await instance.delete(`/deleteMarca/${id}`, { data: { usuarioId } });
    console.log("Marca eliminada:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar marca:", error);
    throw error;
  }
}
