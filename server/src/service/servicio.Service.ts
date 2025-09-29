import { coneccion } from "../config/conexion";
import { ServicioEquipo } from "../interface";

const cn = coneccion();


const listServicio = async (
    usuarioId: number,
    pageIndex: number = 0,
    pageSize: number = 10,
    estadoId: number | null = null,
    clienteId: number | null = null
) => {
    console.log("Parámetros enviados a sp_servicio_listar:", {
        usuarioId,
        pageIndex,
        pageSize,
        estadoId,
        clienteId
    });

    try {
        const [results]: any = await cn
            .promise()
            .query(
                "CALL sp_servicio_listar(?, ?, ?, ?, ?)",
                [usuarioId, pageIndex, pageSize, estadoId, clienteId]
            );

        console.log("Resultados de sp_servicio_listar:", {
            data: results[0],
            total: results[1][0].total
        });

        return {
            status: 200,
            success: true,
            data: results[0],
            total: results[1][0].total,
        };
    } catch (error: any) {
        console.error("Error en listar servicios:", error);

        // Manejar errores específicos de permisos
        if (error.code === '45000') {
            return {
                status: 403,
                success: false,
                mensaje: error.message || "No tiene permisos para realizar esta acción",
            };
        }

        return {
            status: 500,
            success: false,
            mensaje: "Error en la base de datos",
            error: error.sqlMessage || error.message,
        };
    }
};

const listMot_Ingreso = async () => {
    try {
        const [results]: any = await cn
            .promise()
            .query(
                "CALL sp_listar_mot_Ingreso"
            );

        console.log("Resultados de sp_listar_mot_Ingreso:", {
            data: results[0],
        });

        return {
            status: 200,
            success: true,
            data: results[0],
        };
    } catch (error: any) {
        console.error("Error en listar servicios ingresos service:", error);

        return {
            status: 500,
            success: false,
            mensaje: "Error en la base de datos",
            error: error.sqlMessage || error.message,
        };
    }
};

const listEstadoServ = async () => {
    try {
        const [results]: any = await cn
            .promise()
            .query(
                "CALL sp_listar_estados_service"
            );

        console.log("Resultados de sp_listar_estados_service:", {
            data: results[0],
        });

        return {
            status: 200,
            success: true,
            data: results[0],
        };
    } catch (error: any) {
        console.error("Error en listar servicios:", error);

        return {
            status: 500,
            success: false,
            mensaje: "Error en la base de datos",
            error: error.sqlMessage || error.message,
        };
    }
};

const buscarClienteServ = async (
    nombre: string
) => {
    console.log("Parámetros enviados a sp_buscar_cliente_servicio:", { nombre });

    try {
        const [results]: any = await cn
            .promise()
            .query(
                "CALL sp_buscar_cliente_servicio(?)",
                [nombre]
            );

        console.log("Resultados de sp_buscar_cliente_servicio:", { data: results[0] });

        return {
            status: 200,
            success: true,
            data: results[0],
            total: results[0]?.length || 0,
        };
    } catch (error: any) {
        console.error("Error en buscar cliente servicio:", error);

        return {
            status: 500,
            success: false,
            mensaje: "Error en la base de datos",
            error: error.sqlMessage || error.message,
        };
    }
};
const buscarProduct = async (
    filtro: string
) => {
    console.log("Parámetros enviados a sp_filtrar_productos:", { filtro });

    try {
        const [results]: any = await cn
            .promise()
            .query(
                "CALL sp_filtrar_productos(?)",
                [filtro]
            );

        console.log("Resultados de sp_filtrar_productos:", { data: results[0] });

        return {
            status: 200,
            success: true,
            data: results[0],
            total: results[0]?.length || 0,
        };
    } catch (error: any) {
        console.error("Error en buscar productos en servicio:", error);

        return {
            status: 500,
            success: false,
            mensaje: "Error en la base de datos",
            error: error.sqlMessage || error.message,
        };
    }
};

const obtenerEquiposPorCliente = async (cliente_id: number) => {
    try {
        const [results]: any = await cn
            .promise()
            .query(
                "CALL sp_obtener_equipos_por_cliente(?)",
                [cliente_id]
            );

        console.log("Resultados de sp_obtener_equipos_por_cliente:", { data: results[0] });

        return {
            status: 200,
            success: true,
            data: results[0],
            total: results[0]?.length || 0,
        };
    } catch (error: any) {
        console.error("Error en obtener equipos por cliente:", error);

        return {
            status: 500,
            success: false,
            mensaje: "Error en la base de datos",
            error: error.sqlMessage || error.message,
        };
    }
};

const registrarServicioBasico = async (
    motivo_ingreso_id: number,
    descripcion_motivo: string,
    observacion: string,
    usuario_recibe_id: number,
    servicio_equipos_id: number,
    cliente_id: number
) => {
    try {
        const [results]: any = await cn
            .promise()
            .query(
                "CALL sp_registrar_servicio_basico(?, ?, ?, ?, ?, ?)",
                [motivo_ingreso_id, descripcion_motivo, observacion, usuario_recibe_id, servicio_equipos_id, cliente_id]
            );

        const servicioId = results[0][0].id_servicio_generado;
        const codigoSeguimiento = results[0][0].codigo_seguimiento;
        const precioTotal = results[0][0].precio_total;

        return {
            status: 200,
            success: true,
            data: {
                id_servicio: servicioId,
                codigo_seguimiento: codigoSeguimiento,
                precio_total: precioTotal
            },
            mensaje: "Servicio registrado exitosamente"
        };
    } catch (error: any) {
        console.error("Error en registrar servicio básico:", error);
        return {
            status: 500,
            success: false,
            mensaje: "Error en la base de datos",
            error: error.sqlMessage || error.message,
        };
    }
};

const iniciarReparacion = async (
  servicio_id: number,
  usuario_soluciona_id: number
) => {
  try {
    const [results]: any = await cn
      .promise()
      .query("CALL sp_iniciar_reparacion(?, ?)", [
        servicio_id,
        usuario_soluciona_id
      ]);

    // Como el SP devuelve un SELECT final, la data viene en results[0]
    const servicioActualizado = results[0][0];

    return {
      status: 200,
      success: true,
      data: servicioActualizado,
      mensaje: "Reparación iniciada correctamente"
    };
  } catch (error: any) {
    console.error("Error en iniciarReparacion:", error);
    return {
      status: 500,
      success: false,
      mensaje: "Error en la base de datos",
      error: error.sqlMessage || error.message,
    };
  }
};

const actualizarServicioReparacion = async (
    servicio_id: number,
    diagnostico: string,
    solucion: string,
    precio_mano_obra: number,
    usuario_soluciona_id: number,
    estado_id: number,
    repuestos: Array<{
        producto_id: number;
        cantidad: number;
        precio_unitario: number;
    }> = []
) => {
    try {
        const repuestosJSON = JSON.stringify(repuestos);

        const [results]: any = await cn
            .promise()
            .query(
                "CALL sp_actualizar_servicio_reparacion(?, ?, ?, ?, ?, ?, ?)",
                [servicio_id, diagnostico, solucion, precio_mano_obra, usuario_soluciona_id, estado_id, repuestosJSON]
            );

        return {
            status: 200,
            success: true,
            data: results[0][0],
            mensaje: estado_id === 2
                ? "Servicio actualizado a 'En reparación'"
                : "Servicio marcado como 'Reparado'"
        };
    } catch (error: any) {
        console.error("Error en actualizar servicio reparación:", error);

        return {
            status: 500,
            success: false,
            mensaje: "Error en la base de datos",
            error: error.sqlMessage || error.message,
        };
    }
};

const entregarServicioCliente = async (
    servicio_id: number,
    usuario_entrega_id: number
) => {
    try {
        const [results]: any = await cn
            .promise()
            .query(
                "CALL sp_entregar_servicio_cliente(?, ?)",
                [servicio_id, usuario_entrega_id]
            );

        return {
            status: 200,
            success: true,
            data: results[0][0],
            mensaje: "Servicio entregado exitosamente al cliente"
        };
    } catch (error: any) {
        console.error("Error en entregar servicio:", error);

        return {
            status: 500,
            success: false,
            mensaje: "Error en la base de datos",
            error: error.sqlMessage || error.message,
        };
    }
};




export { listServicio, listEstadoServ, listMot_Ingreso,iniciarReparacion, buscarProduct, buscarClienteServ, obtenerEquiposPorCliente, registrarServicioBasico, actualizarServicioReparacion, entregarServicioCliente };
