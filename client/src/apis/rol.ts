import { Rol } from "@/interface";
import { instance } from "@/lib/axios";

// ----------------------
// Listar tipos de documento
// ----------------------
export const fetchRol = async (
  usuarioId: number,
  pageIndex = 0,
  pageSize = 10
) => {
  try {
    const response = await instance.get<{
      data: Rol[];
      total: number;
    }>(`/getAllRol/${usuarioId}?pageIndex=${pageIndex}&pageSize=${pageSize}`);

    const { data, total } = response.data;

    console.log("roles obtenidos:", { data, total });
    return { data, total };
  } catch (error) {
    console.error("Error al obtener los roles:", error);
    throw error;
  }
};
