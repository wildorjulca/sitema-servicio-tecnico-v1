import { coneccion } from "../config/conexion"
import bcryptjs from 'bcryptjs';
import { createResponse } from "../utils/response";


const cn = coneccion()

const listUsers = async (
    usuarioId: number,
    pageIndex = 0,
    pageSize = 10
) => {
    console.log("Parámetros enviados a sp_user:", { usuarioId, pageIndex, pageSize });
    try {
        const [results]: any = await cn
            .promise()
            .query(
                "CALL sp_user(?, ?, ?, ?, ?, ?)",
                ["LISTAR_USERS", null, null, pageIndex, pageSize, usuarioId]
            );

        console.log("Resultados de sp_user:", { data: results[0], total: results[1][0].total });
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




// Insertar usuario
const createUser = async (user: any) => {
    try {
        // Encriptar la contraseña usando tu misma función o directamente
        const passwordHash = await bcryptjs.hash(user.password, 10);

        const [rows]: any = await cn
            .promise()
            .query("CALL sp_usuarios_crud(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
                "INSERTAR_USUARIO",
                null,
                user.nombre,
                user.apellidos,
                user.dni,
                user.telefono || null,
                user.usuario,
                passwordHash, // ← Contraseña encriptada
                user.rol_id,
                user.usuarioId
            ]);

        const idInsertado = rows[0][0]?.id_insertado;

        return createResponse(201, true, "Usuario creado correctamente", {
            id: idInsertado
        });
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            return createResponse(400, false, "El DNI o usuario ya existe");
        }
        return createResponse(500, false, "Error en la base de datos", error);
    }
};

// Actualizar usuario
const updateUser = async (user: any) => {  // ← Solo 1 parámetro
    try {
        console.log("📝 Datos recibidos para actualizar:", {
            id: user.id,
            nombre: user.nombre,
            apellidos: user.apellidos,
            dni: user.dni,
            telefono: user.telefono,
            usuario: user.usuario,
            tienePassword: !!user.password,
            rol_id: user.rol_id,
            usuarioId: user.usuarioId
        });

        let passwordHash = null;

        // Solo encriptar si se está actualizando la contraseña
        if (user.password && user.password.trim() !== '') {
            passwordHash = await bcryptjs.hash(user.password, 10);
            console.log("🔐 Contraseña encriptada");
        } else {
            console.log("🔓 No se cambió la contraseña");
            // ⚠️ Aquí está el problema - no podemos enviar NULL
        }

        // ⚠️ PROBLEMA: Si passwordHash es NULL, tu BD da error
        const [rows]: any = await cn
            .promise()
            .query("CALL sp_usuarios_crud(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
                "ACTUALIZAR_USUARIO",
                user.id,
                user.nombre,
                user.apellidos,
                user.dni,
                user.telefono || null,
                user.usuario,
                passwordHash, // ← Este es NULL y causa el error
                user.rol_id,
                user.usuarioId
            ]);

        const filasAfectadas = rows[0][0]?.filas_afectadas || 0;

        if (filasAfectadas > 0) {
            return createResponse(200, true, "Usuario actualizado correctamente", {
                filasAfectadas
            });
        } else {
            return createResponse(404, false, "No se encontró el usuario");
        }
    } catch (error: any) {
        console.error("❌ Error en updateUser:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return createResponse(400, false, "El DNI o usuario ya existe");
        }
        return createResponse(500, false, "Error en la base de datos", error);
    }
};
// Eliminar usuario
const deleteUser = async (id: number, usuarioId: number) => {
    try {
        const [rows]: any = await cn
            .promise()
            .query("CALL sp_usuarios_crud(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
                "ELIMINAR_USUARIO",
                id,
                null, null, null, null, null, null, null,
                usuarioId
            ]);

        const filasAfectadas = rows[0][0]?.filas_afectadas || 0;

        if (filasAfectadas > 0) {
            return createResponse(200, true, "Usuario eliminado correctamente", {
                filasAfectadas
            });
        } else {
            return createResponse(404, false, "No se encontró el usuario");
        }
    } catch (error: any) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return createResponse(400, false, "No se puede eliminar el usuario porque está siendo utilizado en otros registros");
        }
        return createResponse(500, false, "Error en la base de datos", error);
    }
};


export { listUsers, createUser, updateUser, deleteUser }