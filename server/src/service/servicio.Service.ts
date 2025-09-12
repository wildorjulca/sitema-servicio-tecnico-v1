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

// Insertar servicio equipo
const createServicio = async (servicioEquipo: ServicioEquipo) => {
    if (!servicioEquipo.EQUIPO_idEquipo || !servicioEquipo.MARCA_idMarca) {
        return {
            status: 400,
            success: false,
            mensaje: "EQUIPO_idEquipo y MARCA_idMarca son obligatorios",
        };
    }

    try {
        const [rows]: any = await cn.promise().query("CALL sp_servicio_equipos_crud(?, ?, ?, ?, ?, ?, ?, ?)", [
            "INSERTAR_SERVICIO_EQUIPO",
            null,
            servicioEquipo.EQUIPO_idEquipo,
            servicioEquipo.MARCA_idMarca,
            servicioEquipo.modelo || null,
            servicioEquipo.serie || null,
            servicioEquipo.codigo_barras || null,
            servicioEquipo.usuarioId,
        ]);

        const idInsertado = rows[0][0]?.id_insertado;

        return {
            status: 201,
            success: true,
            mensaje: "Servicio equipo creado correctamente",
            data: { id: idInsertado },
        };
    } catch (error: any) {
        return {
            status: 500,
            success: false,
            mensaje: "Error en la base de datos",
            error: error.sqlMessage || error.message,
        };
    }
};

// Actualizar servicio equipo
const updateServicio = async (servicioEquipo: ServicioEquipo) => {
    if (!servicioEquipo.idServicioEquipos) {
        return {
            status: 400,
            success: false,
            mensaje: "El idServicioEquipos es obligatorio",
        };
    }

    try {
        const [rows]: any = await cn.promise().query("CALL sp_servicio_equipos_crud(?, ?, ?, ?, ?, ?, ?, ?)", [
            "ACTUALIZAR_SERVICIO_EQUIPO",
            servicioEquipo.idServicioEquipos,
            servicioEquipo.EQUIPO_idEquipo,
            servicioEquipo.MARCA_idMarca,
            servicioEquipo.modelo || null,
            servicioEquipo.serie || null,
            servicioEquipo.codigo_barras || null,
            servicioEquipo.usuarioId,
        ]);

        const filasAfectadas = rows[0][0]?.filas_afectadas || 0;

        return {
            status: 200,
            success: true,
            mensaje: filasAfectadas > 0 ? "Servicio equipo actualizado" : "No se encontró el servicio equipo",
            data: { filasAfectadas },
        };
    } catch (error: any) {
        return {
            status: 500,
            success: false,
            mensaje: "Error en la base de datos",
            error: error.sqlMessage || error.message,
        };
    }
};

// Eliminar servicio equipo
const deleteServicio = async (idServicioEquipos: number, usuarioId: number) => {
    if (!idServicioEquipos) {
        return {
            status: 400,
            success: false,
            mensaje: "El idServicioEquipos es obligatorio",
        };
    }

    try {
        const [rows]: any = await cn.promise().query("CALL sp_servicio_equipos_crud(?, ?, ?, ?, ?, ?, ?, ?)", [
            "ELIMINAR_SERVICIO_EQUIPO",
            idServicioEquipos,
            null,
            null,
            null,
            null,
            null,
            usuarioId,
        ]);

        const filasAfectadas = rows[0][0]?.filas_afectadas || 0;

        return {
            status: 200,
            success: true,
            mensaje: filasAfectadas > 0 ? "Servicio equipo eliminado" : "No se encontró el servicio equipo",
            data: { filasAfectadas },
        };
    } catch (error: any) {
        return {
            status: 500,
            success: false,
            mensaje: "Error en la base de datos",
            error: error.sqlMessage || error.message,
        };
    }
};


export { listServicio, createServicio, updateServicio, deleteServicio };
