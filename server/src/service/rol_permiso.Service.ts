import { coneccion } from "../config/conexion"

const cn = coneccion()

const gestionarRolPermisos = async (
    accion: string,
    rol_id: number,
    idUsuario: number,
    permisos_json?: number[] // Array de IDs de permisos
) => {
    console.log("Parámetros enviados a sp_gestionar_rol_permisos:", { 
        accion, 
        rol_id, 
        idUsuario, 
        permisos_json 
    });

    try {
        const permisosJSON = permisos_json ? JSON.stringify(permisos_json) : null;

        const [results]: any = await cn
            .promise()
            .query(
                "CALL sp_gestionar_rol_permisos(?, ?, ?, ?)",
                [accion, rol_id, idUsuario, permisosJSON]
            );

        console.log("Resultados de sp_gestionar_rol_permisos:", { 
            data: results[0] 
        });

        return {
            status: 200,
            success: true,
            data: results[0] || [],
            mensaje: accion === 'GUARDAR_PERMISOS' 
                ? "Permisos actualizados correctamente" 
                : "Datos obtenidos correctamente"
        };
    } catch (error: any) {
        console.log("Error en gestionar rol permisos:", error);
        return {
            status: 500,
            success: false,
            mensaje: "Error en la base de datos",
            error: error.sqlMessage || error.message,
        };
    }
};

// ✅ FUNCIÓN ESPECÍFICA PARA LISTAR PERMISOS DE UN ROL
const listarPermisosRol = async (rol_id: number, idUsuario: number) => {
    return await gestionarRolPermisos('LISTAR_PERMISOS_ROL', rol_id, idUsuario);
};

// ✅ FUNCIÓN ESPECÍFICA PARA GUARDAR PERMISOS
const guardarPermisosRol = async (rol_id: number, idUsuario: number, permisos: number[]) => {
    return await gestionarRolPermisos('GUARDAR_PERMISOS', rol_id, idUsuario, permisos);
};

export { 
    gestionarRolPermisos, 
    listarPermisosRol, 
    guardarPermisosRol 
};