import { coneccion } from "../config/conexion";
import { ResultSetHeader, RowDataPacket } from 'mysql2'
import { Technical } from "../interface";
import bcryptjs from 'bcryptjs'
import { createResponse } from "../utils/response";
const cn = coneccion()

const authservice = async (usuario: string, password: string) => {
    try {
        const [result] = await cn.promise().query<[RowDataPacket[], ResultSetHeader]>("CALL auth_login(?)", [usuario]);

        const tecnico: Technical[] = result[0] as Technical[];

        // Si no se encuentra el usuario
        if (tecnico.length === 0) {
            return createResponse(401, false, "Not user found");
        }

        // Si el usuario se encuentra, comparas la contraseña
        const item = tecnico[0];
        // const comparePass = bcryptjs.compareSync(password, item.password);
        const comparePass = item.password === password

        // Si la contraseña no coincide
        if (!comparePass) {
            return createResponse(401, false, "Incorrect password");
        }

        // Si la autenticación es exitosa
        return createResponse(200, true, "User authenticated successfully", item.idTecnico);

    } catch (error) {
        console.log({ error });
        return createResponse(500, false, "Error de servidor o en la base de datos", error);
        // return {
        //     status: 500,
        //     success: false,
        //     mensaje: "Error de servidor o en la base de datos",
        //     error: error,
        // };
    }
};

export { authservice }