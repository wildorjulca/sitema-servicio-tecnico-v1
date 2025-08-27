import { coneccion } from "../config/conexion"

const cn = coneccion()

const listRol = async (
    usuarioId: number,
    pageIndex = 0,
    pageSize = 10
) => {
    console.log("Parámetros enviados a sp_roles:", { usuarioId, pageIndex, pageSize });
    try {
        const [results]: any = await cn
            .promise()
            .query(
                "CALL sp_rol(?, ?, ?, ?, ?, ?)",
                ["LISTAR_ROL", null, null, pageIndex, pageSize, usuarioId]
            );

        console.log("Resultados de sp_rol", { data: results[0], total: results[1][0].total });
        return {
            status: 200,
            success: true,
            data: results[0],
            total: results[1][0].total,
        };
    } catch (error: any) {
        console.log("Error en listar roles:", error);
        return {
            status: 500,
            success: false,
            mensaje: "Error en la base de datos",
            error: error.sqlMessage || error.message,
        };
    }
};


export { listRol }