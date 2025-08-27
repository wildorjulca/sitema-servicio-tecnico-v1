import { coneccion } from "../config/conexion"

const cn = coneccion()

const listPermisosSistema = async (
    usuarioId: number,
    pageIndex = 0,
    pageSize = 10
) => {
    console.log("Parámetros enviados a sp_permisos:", { usuarioId, pageIndex, pageSize });
    try {
        const [results]: any = await cn
            .promise()
            .query(
                "CALL sp_permisos(?, ?, ?, ?, ?, ?)",
                ["LISTAR_PERMISO", null, null, pageIndex, pageSize, usuarioId]
            );

        console.log("Resultados de sp_permisos", { data: results[0], total: results[1][0].total });
        return {
            status: 200,
            success: true,
            data: results[0],
            total: results[1][0].total,
        };
    } catch (error: any) {
        console.log("Error en listar tipo doc:", error);
        return {
            status: 500,
            success: false,
            mensaje: "Error en la base de datos",
            error: error.sqlMessage || error.message,
        };
    }
};


export { listPermisosSistema }