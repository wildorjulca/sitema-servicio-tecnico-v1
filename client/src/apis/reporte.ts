import { instance } from "@/lib/axios";

// Reporte por periodo
export const fetchReportePeriodo = async (tipoPeriodo: string, fechaBase: string) => {
  try {
    const response = await instance.get<{
      data: {
        resumen: any;
        detalle: any[];
      };
    }>(`/servicios-periodo?tipoPeriodo=${tipoPeriodo}&fechaBase=${fechaBase}`);

    const { data } = response.data;

    console.log("Reporte periodo obtenido:", { data });
    return { data };
  } catch (error) {
    console.error("Error al obtener el reporte periodo:", error);
    throw error;
  }
};

// Alertas de inventario
export const fetchAlertasInventario = async () => {
  try {
    const response = await instance.get<{
      data: any[];
      total: number;
    }>('/alertas-inventario');

    const { data, total } = response.data;

    console.log("Alertas obtenidas:", { data, total });
    return { data, total };
  } catch (error) {
    console.error("Error al obtener las alertas:", error);
    throw error;
  }
};
