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
    filtro: string
) => {
    console.log("Parámetros enviados a sp_buscar_cliente_servicio:", { filtro });

    try {
        const [results]: any = await cn
            .promise()
            .query(
                "CALL sp_buscar_cliente_servicio(?)",
                [filtro]
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

const registrarServicioBasico = async (
    fechaIngreso: string,
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
                "CALL sp_registrar_servicio_basico(?, ?, ?, ?, ?, ?, ?)",
                [fechaIngreso, motivo_ingreso_id, descripcion_motivo, observacion, usuario_recibe_id, servicio_equipos_id, cliente_id]
            );

        const servicioId = results[0][0].id_servicio_generado;
        const codigoSeguimiento = results[0][0].codigo_seguimiento;

        return {
            status: 200,
            success: true,
            data: {
                id_servicio: servicioId,
                codigo_seguimiento: codigoSeguimiento
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



export { listServicio, registrarServicioBasico, listEstadoServ, buscarClienteServ,actualizarServicioReparacion,entregarServicioCliente };
