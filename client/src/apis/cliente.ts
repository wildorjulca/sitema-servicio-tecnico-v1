import { Cliente } from "@/interface";
import { instance } from "@/lib/axios";

// ----------------------
// Listar cliente
// ----------------------
export const fetchCliente = async (
  usuarioId: number,
  pageIndex = 0,
  pageSize = 10
) => {
  try {
    const response = await instance.get<{
      data: Cliente[];
      total: number;
    }>(`/getAllCliente/${usuarioId}?pageIndex=${pageIndex}&pageSize=${pageSize}`);

    const { data, total } = response.data;

    console.log("cleintes obtenidos:", { data, total });
    return { data, total };
  } catch (error) {
    console.error("Error al obtener los cleintes:", error);
    throw error;
  }
};
