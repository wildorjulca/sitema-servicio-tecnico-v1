import { instance } from "@/lib/axios";

// Definir la interfaz para los tipos de documento
export interface TipoDoc {
  id_tipo:number,
  cod_tipo: string;
  nombre_tipo: string;
  cant_digitos: number;
}

// ----------------------
// Listar tipos de documento
// ----------------------
export const fetchTipoDoc = async (
  usuarioId: number,
  pageIndex = 0,
  pageSize = 10
) => {
  try {
    const response = await instance.get<{
      data: TipoDoc[];
      total: number;
    }>(`/getAllDoc/${usuarioId}?pageIndex=${pageIndex}&pageSize=${pageSize}`);

    const { data, total } = response.data;

    console.log("Tipos de documento obtenidos:", { data, total });
    return { data, total };
  } catch (error) {
    console.error("Error al obtener tipos de documento:", error);
    throw error;
  }
};
