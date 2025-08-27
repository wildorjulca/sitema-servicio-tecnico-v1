import { Permiso } from "@/interface";
import { instance } from "@/lib/axios";

// ----------------------
// Listar tipos de documento
// ----------------------
export const fetchPermiso = async (
  usuarioId: number,
  pageIndex = 0,
  pageSize = 10
) => {
  try {
    const response = await instance.get<{
      data: Permiso[];
      total: number;
    }>(`/getAllPermiso/${usuarioId}?pageIndex=${pageIndex}&pageSize=${pageSize}`);

    const { data, total } = response.data;

    console.log("permisos obtenidos:", { data, total });
    return { data, total };
  } catch (error) {
    console.error("Error al obtener los permisos:", error);
    throw error;
  }
};
