import { coneccion } from "../config/conexion"

const cn = coneccion()

const listCat = async (
    usuarioId: number,
    pageIndex = 0,
    pageSize = 10
) => {
    console.log("Parámetros enviados a sp_categoria :", { usuarioId, pageIndex, pageSize });
    try {
        const [results]: any = await cn
            .promise()
            .query(
                "CALL sp_categoria (?, ?, ?, ?, ?, ?)",
                ["LISTAR_CATEGORIA", null, null, pageIndex, pageSize, usuarioId]
            );

        console.log("Resultados de sp_categoria", { data: results[0], total: results[1][0].total });
        return {
            status: 200,
            success: true,
            data: results[0],
            total: results[1][0].total,
        };
    } catch (error: any) {
        console.log("Error en listar categoria :", error);
        return {
            status: 500,
            success: false,
            mensaje: "Error en la base de datos",
            error: error.sqlMessage || error.message,
        };
    }
};


// Crear categoria
const createCat = async (cat: any) => {
    if (!cat.descripcion) {
        return {
            status: 400,
            success: false,
            mensaje: "La descripción del motivo es obligatoria",
        };
    }

    try {
        const [rows]: any = await cn
            .promise()
            .query("CALL sp_categoria_crud(?, ?, ?, ?, ?)", [
                "INSERTAR_CATEGORIA",
                null,
                cat.descripcion,
                cat.esServicio || null,
                cat.usuarioId,
            ]);

        const idInsertado = rows[0][0]?.id_insertado;

        return {
            status: 201,
            success: true,
            mensaje: "categoria creado correctamente",
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

// Actualizar categoria
const updateCat = async (cat: any) => {
    if (!cat.id || !cat.descripcion) {
        return {
            status: 400,
            success: false,
            mensaje: "El id y la descripción de la categoria son obligatorios",
        };
    }

    try {
        const [rows]: any = await cn
            .promise()
            .query("CALL sp_categoria_crud(?, ?, ?, ?, ?)", [
                "ACTUALIZAR_CATEGORIA",
                cat.id,
                cat.descripcion,
                cat.esServicio || null,
                cat.usuarioId,
            ]);

        const filasAfectadas = rows[0][0]?.filas_afectadas || 0;

        return {
            status: 200,
            success: true,
            mensaje:
                filasAfectadas > 0
                    ? "categoria actualizado"
                    : "No se encontró la categoria",
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

// Eliminar categoria
const deleteCat = async (id: number, usuarioId: number) => {
    if (!id) {
        return {
            status: 400,
            success: false,
            mensaje: "El id del categoria es obligatorio",
        };
    }

    try {
        const [rows]: any = await cn
            .promise()
            .query("CALL sp_categoria_crud(?, ?, ?, ?, ?)", [
                "ELIMINAR_CATEGORIA",
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
                    ? "categoria eliminada"
                    : "No se encontró la categoria",
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


export { listCat , createCat, updateCat, deleteCat }