import { coneccion } from "../config/conexion"

const cn = coneccion()

const listMotivoIngreso = async (
    usuarioId: number,
    pageIndex = 0,
    pageSize = 10
) => {
    console.log("Parámetros enviados a sp_motivo_ingreso:", { usuarioId, pageIndex, pageSize });
    try {
        const [results]: any = await cn
            .promise()
            .query(
                "CALL sp_motivo_ingreso(?, ?, ?, ?, ?, ?)",
                ["LISTAR_MOTIVO_INGRESO", null, null, pageIndex, pageSize, usuarioId]
            );

        console.log("Resultados de sp_rol", { data: results[0], total: results[1][0].total });
        return {
            status: 200,
            success: true,
            data: results[0],
            total: results[1][0].total,
        };
    } catch (error: any) {
        console.log("Error en listar motivos ingresos:", error);
        return {
            status: 500,
            success: false,
            mensaje: "Error en la base de datos",
            error: error.sqlMessage || error.message,
        };
    }
};

// Crear motivo de ingreso
const createMotivo = async (motivo: any) => {
    if (!motivo.descripcion) {
        return {
            status: 400,
            success: false,
            mensaje: "La descripción del motivo es obligatoria",
        };
    }

    try {
        const [rows]: any = await cn
            .promise()
            .query("CALL sp_motivo_ingreso_crud(?, ?, ?, ?, ?)", [
                "INSERTAR_MOTIVO",
                null,
                motivo.descripcion,
                motivo.precio_cobrar || null,
                motivo.usuarioId,
            ]);

        const idInsertado = rows[0][0]?.id_insertado;

        return {
            status: 201,
            success: true,
            mensaje: "Motivo de ingreso creado correctamente",
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

// Actualizar motivo de ingreso
const updateMotivo = async (motivo: any) => {
    if (!motivo.id || !motivo.descripcion) {
        return {
            status: 400,
            success: false,
            mensaje: "El id y la descripción del motivo son obligatorios",
        };
    }

    try {
        const [rows]: any = await cn
            .promise()
            .query("CALL sp_motivo_ingreso_crud(?, ?, ?, ?, ?)", [
                "ACTUALIZAR_MOTIVO",
                motivo.id,
                motivo.descripcion,
                motivo.precio_cobrar || null,
                motivo.usuarioId,
            ]);

        const filasAfectadas = rows[0][0]?.filas_afectadas || 0;

        return {
            status: 200,
            success: true,
            mensaje:
                filasAfectadas > 0
                    ? "Motivo de ingreso actualizado"
                    : "No se encontró el motivo de ingreso",
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

// Eliminar motivo de ingreso
const deleteMotivo = async (id: number, usuarioId: number) => {
    if (!id) {
        return {
            status: 400,
            success: false,
            mensaje: "El id del motivo de ingreso es obligatorio",
        };
    }

    try {
        const [rows]: any = await cn
            .promise()
            .query("CALL sp_motivo_ingreso_crud(?, ?, ?, ?, ?)", [
                "ELIMINAR_MOTIVO",
                id,
                null,
                null,
                usuarioId,
            ]);

        const filasAfectadas = rows[0][0]?.filas_afectadas || 0;

        return {
            status: 200,
            success: true,
            mensaje:
                filasAfectadas > 0
                    ? "Motivo de ingreso eliminado"
                    : "No se encontró el motivo de ingreso",
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



export { listMotivoIngreso, createMotivo, updateMotivo, deleteMotivo }