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
    motivos: any[],  // CAMBIO: Array de motivos
    observacion: string,
    usuario_recibe_id: number,
    servicio_equipos_id: number,
    cliente_id: number,
    precio_total?: number  // CAMBIO: precio_final -> precio_total
) => {
    try {
        // Convertir array de motivos a JSON string
        const motivosJson = JSON.stringify(motivos);

        const [results]: any = await cn
            .promise()
            .query(
                "CALL sp_registrar_servicio_basico(?, ?, ?, ?, ?, ?)", // 6 parámetros ahora
                [
                    motivosJson,           // JSON con motivos
                    observacion,
                    usuario_recibe_id,
                    servicio_equipos_id,
                    cliente_id,
                    precio_total !== undefined ? precio_total : 0
                ]
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
            motivos: motivos  // CAMBIO: Enviar array de motivos
        });

        console.log('✅ Servicio registrado con', motivos.length, 'motivos');
        console.log('💰 Precio total:', precioTotal);

        return {
            status: 200,
            success: true,
            data: {
                id_servicio: servicioId,
                codigo_seguimiento: codigoSeguimiento,
                precio_total: precioTotal,
                motivos_registrados: motivos.length
            },
            mensaje: `Servicio registrado exitosamente con ${motivos.length} motivo(s)`
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

const guardarAvanceTecnico = async (
    servicio_id: number,
    diagnostico: string,
    solucion: string,
    precio_mano_obra: number,
    usuario_soluciona_id: number
) => {
    try {
        const [results]: any = await cn
            .promise()
            .query(
                "CALL sp_guardar_avance_tecnico(?, ?, ?, ?, ?)",
                [servicio_id, diagnostico, solucion, precio_mano_obra, usuario_soluciona_id]
            );

        // 🔥 EMITIR POR WEBSOCKET - Avance guardado
        emitServicioActualizado(
            servicio_id,
            2, // Estado "En reparación"
            { diagnostico, solucion, precio_mano_obra }
        );

        return {
            status: 200,
            success: true,
            data: { servicio_id, diagnostico, solucion, precio_mano_obra },
            mensaje: "Avance guardado correctamente"
        };
    } catch (error: any) {
        console.error("Error al guardar avance:", error);
        return {
            status: 500,
            success: false,
            mensaje: "Error al guardar avance",
            error: error.sqlMessage || error.message,
        };
    }
};

const agregarRepuestosSecretaria = async (
    servicio_id: number,
    repuestos: Array<{
        producto_id: number;
        cantidad: number;
        precio_unitario: number;
    }>,
    usuario_agrega_id: number
) => {
    try {
        const repuestosJSON = JSON.stringify(repuestos);

        await cn
            .promise()
            .query(
                "CALL sp_agregar_repuestos_secretaria(?, ?, ?)",
                [servicio_id, repuestosJSON, usuario_agrega_id]
            );

        // 🔥 EMITIR POR WEBSOCKET - Repuestos agregados
        emitServicioActualizado(
            servicio_id,
            null, // No cambia estado
            { repuestos_agregados: repuestos.length }
        );

        return {
            status: 200,
            success: true,
            mensaje: `${repuestos.length} repuestos agregados correctamente`
        };
    } catch (error: any) {
        console.error("Error al agregar repuestos:", error);
        return {
            status: 500,
            success: false,
            mensaje: "Error al agregar repuestos",
            error: error.sqlMessage || error.message,
        };
    }
};

const eliminarRepuestosSecretaria = async (
    servicio_id: number,
    repuestos_ids: number[], // Array de IDs de repuestos a eliminar [1, 3, 5]
    usuario_elimina_id: number
) => {
    try {
        const repuestosIdsJSON = JSON.stringify(repuestos_ids);

        await cn
            .promise()
            .query(
                "CALL sp_eliminar_repuestos_cliente(?, ?, ?)",
                [servicio_id, repuestosIdsJSON, usuario_elimina_id]
            );

        // 🔥 EMITIR POR WEBSOCKET - Repuestos eliminados
        emitServicioActualizado(
            servicio_id,
            null, // No cambia estado
            { repuestos_eliminados: repuestos_ids.length }
        );

        return {
            status: 200,
            success: true,
            mensaje: `${repuestos_ids.length} repuesto(s) eliminado(s) correctamente`
        };
    } catch (error: any) {
        console.error("Error al eliminar repuestos:", error);
        return {
            status: 500,
            success: false,
            mensaje: "Error al eliminar repuestos",
            error: error.sqlMessage || error.message,
        };
    }
};

const finalizarReparacion = async (
    servicio_id: number,
    usuario_soluciona_id: number
) => {
    try {
        const [results]: any = await cn
            .promise()
            .query(
                "CALL sp_finalizar_reparacion(?, ?)",
                [servicio_id, usuario_soluciona_id]
            );

        const servicioFinalizado = results[0] ? results[0][0] : null;

        // 🔥 EMITIR POR WEBSOCKET - Servicio terminado
        emitServicioActualizado(
            servicio_id,
            3, // Estado "Terminado"
            servicioFinalizado
        );

        return {
            status: 200,
            success: true,
            data: servicioFinalizado,
            mensaje: "Reparación finalizada correctamente"
        };
    } catch (error: any) {
        console.error("Error al finalizar reparación:", error);
        return {
            status: 500,
            success: false,
            mensaje: "Error al finalizar reparación",
            error: error.sqlMessage || error.message,
        };
    }
};

// services/servicioService.ts - AGREGAR ESTA FUNCIÓN
const obtenerRepuestosServicioService = async (servicioId: number) => {
    try {
        const [results]: any = await cn
            .promise()
            .query("CALL sp_obtener_repuestos_servicio(?)", [servicioId]);

        return {
            success: true,
            data: results[0] || [],
            count: results[0] ? results[0].length : 0
        };
    } catch (error: any) {
        console.error('Error en servicio obtener repuestos:', error);
        return {
            success: false,
            mensaje: "Error al obtener repuestos del servicio",
            error: error.sqlMessage || error.message
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
    guardarAvanceTecnico,
    agregarRepuestosSecretaria,
    eliminarRepuestosSecretaria,
    finalizarReparacion,
    obtenerRepuestosServicioService,
    entregarServicioCliente
};