import { CatAdd, Categoria } from "@/interface";
import { instance } from "@/lib/axios";

// ----------------------
// Listar tipos de documento
// ----------------------
export const fetchCat = async (
  usuarioId: number,
  pageIndex = 0,
  pageSize = 10
) => {
  try {
    const response = await instance.get<{
      data: Categoria[];
      total: number;
    }>(`/getAllCat/${usuarioId}?pageIndex=${pageIndex}&pageSize=${pageSize}`);

    const { data, total } = response.data;

    console.log("categorias obtenidos:", { data, total });
    return { data, total };
  } catch (error) {
    console.error("Error al obtener las categorias:", error);
    throw error;
  }
};



// ----------------------
// Agregar categoria
// ----------------------

export const addCatAPI = async ({ descripcion,esServicio, usuarioId }: CatAdd) => {
  try {
    const response = await instance.post("/addCat", { descripcion, esServicio, usuarioId });
    console.log("categoria agregada:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al agregar categoria:", error);
    throw error;
  }
}

// ----------------------
// Actualizar categoria
// ----------------------

export const editCatAPI = async ({ id, descripcion,esServicio, usuarioId }: Categoria) => {
  try {
    console.log("➡️ edit cat payload:", { id, descripcion,esServicio, usuarioId });
    const response = await instance.put(`/updateCat`, { id, descripcion,esServicio, usuarioId });
    console.log("categoria actualizada:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al editar categoria:", error);
    throw error;
  }
}

// ----------------------
// Eliminar categoria
// ----------------------
export const deleteCatAPI = async (id: number, usuarioId: number) => {
  try {
    const response = await instance.delete(`/deleteCat/${id}`, { data: { usuarioId } });
    console.log("categoria eliminada:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar categoria:", error);
    throw error;
  }
}
