import { instance } from "@/lib/axios"


// Interfaces
export interface Brand {
  id: number
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
export const fetchBrands = async (
  usuarioId: number,
  pageIndex = 0,
  pageSize = 10
) => {
  try {
    const response = await instance.get(
      `/getAll/${usuarioId}?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );

    // Asumiendo que la respuesta tiene la estructura { data: [...], total: X }
    const { data, total } = response.data;

    console.log("Marcas obtenidas:", { data, total });
    return { data, total }; // Devolver tanto data como total
  } catch (error) {
    console.error("Error al obtener marcas:", error);
    throw error;
  }
};

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
    console.log("➡️ editBrandAPI payload:", { id, nombre, usuarioId });
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



export const AllMarcaCbo = async (usuarioId: number) => {
  try {
    const response = await instance.get(
      `/getAll/${usuarioId}` // Sin parámetros de paginación
    );

    // Asumiendo que la respuesta tiene la estructura { data: [...], total: X }
    const { data } = response.data;

    console.log("Todas las marcas obtenidas:", data);
    return data; // Devolver solo el array de datos
  } catch (error) {
    console.error("Error al obtener todas las marcas:", error);
    throw error;
  }
};


// ----------------------
// Listar marca sin paginacion
// ----------------------
export const fetchMarca = async (
) => {
  try {
    const response = await instance.get(`/getMarca`);

    const { data } = response.data;

    console.log("Marcas obtenidas:", { data });
    return { data }; // Devolver tanto data como total
  } catch (error) {
    console.error("Error al obtener marcas:", error);
    throw error;
  }
};