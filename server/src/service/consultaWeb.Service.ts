import { coneccion } from "../config/conexion"

const cn = coneccion()

const ConsultarServicioWeb = async (
    codigoSeguimiento: string  // Cambiado de usuarioId a codigoSeguimiento
) => {
    console.log("Parámetros enviados a sp_consulta_publica_servicio:", { codigoSeguimiento });
    try {
        const [results]: any = await cn
            .promise()
            .query(
                "CALL sp_consulta_publica_servicio(?)",
                [codigoSeguimiento.toUpperCase()]  // Convertir a mayúsculas como hace el SP
            );

        console.log("Resultados de sp_consulta_publica_servicio:", { data: results[0] });
        
        return {
            status: 200,
            success: true,
            data: results[0],  // Solo results[0] porque el SP devuelve un solo resultset
        };
    } catch (error: any) {
        console.log("Error en consultar servicio:", error);
        return {
            status: 500,
            success: false,
            mensaje: "Error en la base de datos",
            error: error.sqlMessage || error.message,
        };
    }
};

export{ ConsultarServicioWeb}