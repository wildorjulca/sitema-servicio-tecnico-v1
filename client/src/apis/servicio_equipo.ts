import { ServicioEquipo } from "@/interface";
import { instance } from "@/lib/axios";

export const fetchServ_equipo = async (
  usuarioId: number,
  pageIndex = 0,
  pageSize = 10,
  filtroMarca: number | null = null  // Cambiado a number | null
) => {
  try {
    const response = await instance.get<{
      data: ServicioEquipo[];
      total: number;
    }>(
      `/addServicioEquipos/${usuarioId}?pageIndex=${pageIndex}&pageSize=${pageSize}${
        filtroMarca ? `&filtroMarca=${filtroMarca}` : ""
      }`
    );

    const { data, total } = response.data;

    console.log("servicio_equipos obtenidos:", { data, total });
    return { data, total };
  } catch (error) {
    console.error("Error al obtener los servicio_equipos:", error);
    throw error;
  };
};