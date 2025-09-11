import { coneccion } from "../config/conexion";

const cn = coneccion();

const listServicio_equipo = async (
    usuarioId: number,
    pageIndex = 0,
    pageSize = 10,
    filtroMarca: number | null = null  // Solo queda este parámetro
) => {
    console.log("Parámetros enviados a sp_servicio_equipos:", { usuarioId, pageIndex, pageSize, filtroMarca });

    try {
        const [results]: any = await cn
            .promise()
            .query(
                "CALL sp_servicio_equipos(?, ?, ?, ?, ?)",  // Ahora son 5 parámetros
                ["LISTAR_SERVICIO_EQUIPOS", usuarioId, pageIndex, pageSize, filtroMarca]
            );

        console.log("Resultados de sp_servicio_equipos:", { data: results[0], total: results[1][0].total });

        return {
            status: 200,
            success: true,
            data: results[0],
            total: results[1][0].total,
        };
    } catch (error: any) {
        console.error("Error en listar servicio_equipos:", error);

        return {
            status: 500,
            success: false,
            mensaje: "Error en la base de datos",
            error: error.sqlMessage || error.message,
        };
    }
};
export { listServicio_equipo };
