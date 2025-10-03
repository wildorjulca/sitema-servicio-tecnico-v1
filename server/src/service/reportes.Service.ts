import { coneccion } from "../config/conexion";

const cn = coneccion();

// Reporte por periodo (diario, semanal, mensual)
const reporteServiciosPeriodo = async (
  tipoPeriodo: string,
  fechaBase: string
) => {
  console.log("Parámetros enviados a sp_reporte_servicios_periodo:", {
    tipoPeriodo,
    fechaBase
  });

  try {
    const [results]: any = await cn
      .promise()
      .query(
        "CALL sp_reporte_servicios_periodo(?, ?)",
        [tipoPeriodo, fechaBase]
      );

    console.log("Resultados de sp_reporte_servicios_periodo:", {
      data: results[0],
      detalle: results[1] || []
    });

    return {
      status: 200,
      success: true,
      data: {
        resumen: results[0][0], // El primer resultado es el resumen
        detalle: results[1] || [] // El segundo resultado es el detalle diario (si aplica)
      }
    };
  } catch (error: any) {
    console.error("Error en reporteServiciosPeriodo:", error);
    return {
      status: 500,
      success: false,
      mensaje: "Error al generar el reporte",
      error: error.sqlMessage || error.message,
    };
  }
};

// Alertas de inventario
const alertasInventario = async () => {
  console.log("Ejecutando sp_alertas_inventario");

  try {
    const [results]: any = await cn
      .promise()
      .query("CALL sp_alertas_inventario()");

    console.log("Resultados de sp_alertas_inventario:", {
      data: results[0],
      total: results[0]?.length || 0
    });

    return {
      status: 200,
      success: true,
      data: results[0],
      total: results[0]?.length || 0,
    };
  } catch (error: any) {
    console.error("Error en alertasInventario:", error);
    return {
      status: 500,
      success: false,
      mensaje: "Error al obtener alertas de inventario",
      error: error.sqlMessage || error.message,
    };
  }
};





export {
  reporteServiciosPeriodo,
  alertasInventario,
};