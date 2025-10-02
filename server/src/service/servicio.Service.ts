import { coneccion } from "../config/conexion";
import { emitNuevoServicio, emitServicioActualizado, emitServicioEntregado } from "../../src/index";

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
            .query("CALL sp_listar_mot_Ingreso");

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
            .query("CALL sp_listar_estados_service");

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

const buscarClienteServ = async (nombre: string) => {
    try {
        const [results]: any = await cn
            .promise()
            .query("CALL sp_buscar_cliente_servicio(?)", [nombre]);

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

const buscarProduct = async (filtro: string) => {
    try {
        const [results]: any = await cn
            .promise()
            .query("CALL sp_filtrar_productos(?)", [filtro]);

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
            .query("CALL sp_obtener_equipos_por_cliente(?)", [cliente_id]);

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

// 🔥 NUEVO: Servicio con WebSocket integrado
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

        const servicioCreado = results[0][0];
        const servicioId = servicioCreado.id_servicio_generado;
        const codigoSeguimiento = servicioCreado.codigo_seguimiento;
        const precioTotal = servicioCreado.precio_total;

        // 🔥 EMITIR POR WEBSOCKET - Nuevo servicio creado
        emitNuevoServicio({
            idServicio: servicioId,
            codigoSeguimiento: codigoSeguimiento,
            fechaIngreso: new Date().toISOString(),
            precioTotal: precioTotal,
            estado_id: 1, // Estado inicial "Recibido"
            cliente_id: cliente_id,
            motivo_ingreso_id: motivo_ingreso_id,
            descripcion_motivo: descripcion_motivo
        });

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

// 🔥 NUEVO: Iniciar reparación con WebSocket
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

        const servicioActualizado = results[0][0];

        // 🔥 EMITIR POR WEBSOCKET - Servicio en reparación
        emitServicioActualizado(
            servicio_id, 
            2, // Estado "En reparación"
            servicioActualizado
        );

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

// 🔥 NUEVO: Actualizar servicio con WebSocket
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

        const servicioActualizado = results[0][0];

        // 🔥 EMITIR POR WEBSOCKET - Servicio actualizado
        emitServicioActualizado(
            servicio_id, 
            estado_id, 
            servicioActualizado
        );

        return {
            status: 200,
            success: true,
            data: servicioActualizado,
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

// 🔥 NUEVO: Entregar servicio con WebSocket
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

        const servicioEntregado = results[0][0];

        // 🔥 EMITIR POR WEBSOCKET - Servicio entregado
        emitServicioEntregado(
            servicio_id,
            servicioEntregado
        );

        return {
            status: 200,
            success: true,
            data: servicioEntregado,
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

export { 
    listServicio, 
    listEstadoServ, 
    listMot_Ingreso, 
    iniciarReparacion, 
    buscarProduct, 
    buscarClienteServ, 
    obtenerEquiposPorCliente, 
    registrarServicioBasico, 
    actualizarServicioReparacion, 
    entregarServicioCliente 
};