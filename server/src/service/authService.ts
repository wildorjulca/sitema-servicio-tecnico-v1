import { coneccion } from "../config/conexion";
import { ResultSetHeader, RowDataPacket } from 'mysql2'
import { Technical } from "../interface";
import bcryptjs from 'bcryptjs'
import { createResponse } from "../utils/response";
const cn = coneccion()

const authservice = async (usuario: string, password: string) => {
    try {
        const [result] = await cn.promise().query<[RowDataPacket[], ResultSetHeader]>(
            "CALL auth_login(?)", [usuario]
        );

        const user: any[] = result[0] as any[];

        if (user.length === 0) {
            return createResponse(401, false, "Not user found");
        }

        const item = user[0];
        console.log("DEBUG item:", item);
        // Comparar contraseña
        const comparePass = await bcryptjs.compare(password, String(item.password));
        if (!comparePass) {
            return createResponse(401, false, "Incorrect password");
        }

        // Autenticación exitosa
        return createResponse(200, true, "User authenticated successfully", {
            id: item.idUsuario,
            usuario: item.usuario,
            rol: item.rol,
            nombre: item.nombre,
            apellidos: item.apellidos,
            telefono: item.telefono,
            dni: item.dni,
        });

    } catch (error) {
        console.log({ error });
        return createResponse(500, false, "Error de servidor o en la base de datos", error);
    }
};

const hashText = async (text: string) => {
    const salt = await bcryptjs.genSalt(10) // número de rondas
    const hashed = await bcryptjs.hash(text, salt)
    console.log(`Texto plano: ${text}`)
    console.log(`Hash: ${hashed}`)
    return hashed
}
//  hashText("123456")
export { authservice, hashText }