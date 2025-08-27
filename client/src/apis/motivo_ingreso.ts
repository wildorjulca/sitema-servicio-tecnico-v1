import { addMotivoIngreso, MotivoIngreso} from "@/interface";
import { instance } from "@/lib/axios";

// ----------------------
// Listar tipos de documento
// ----------------------

export const fetchMotivoIngreso = async (
  usuarioId: number,
  pageIndex = 0,
  pageSize = 10
) => {
  try {
    const response = await instance.get<{
      data: MotivoIngreso[];
      total: number;
    }>(`/addMotivoIngreso/${usuarioId}?pageIndex=${pageIndex}&pageSize=${pageSize}`);

    const { data, total } = response.data;

    console.log("motivos Ingresos obtenidos:", { data, total });
    return { data, total };
  } catch (error) {
    console.error("Error al obtener Motivos Ingresos:", error);
    throw error;
  }
};


// ----------------------
// Agregar motivo ingreso
// ----------------------

export const addMotivoIngresoAPI = async ({ descripcion,precio_cobrar, usuarioId }: addMotivoIngreso) => {
  try {
    const response = await instance.post("/addMotivo", { descripcion, precio_cobrar, usuarioId });
    console.log("motivo ingreso agregada:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al agregar motivo ingreso:", error);
    throw error;
  }
}

// ----------------------
// Actualizar motivo ingreso
// ----------------------

export const editMotoviIngresoAPI = async ({ id, descripcion,precio_cobrar, usuarioId }: MotivoIngreso) => {
  try {
    console.log("➡️ editBrandAPI payload:", { id, descripcion,precio_cobrar, usuarioId });
    const response = await instance.put(`/updateMotivo`, { id, descripcion,precio_cobrar, usuarioId });
    console.log("motivo ingreso actualizada:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al editar motivo ingreso:", error);
    throw error;
  }
}

// ----------------------
// Eliminar motivo ingreso
// ----------------------
export const deleteMotivoIngresoAPI = async (id: number, usuarioId: number) => {
  try {
    const response = await instance.delete(`/deleteMotivo/${id}`, { data: { usuarioId } });
    console.log("motivo ingreso eliminada:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar motivo ingreso:", error);
    throw error;
  }
}
