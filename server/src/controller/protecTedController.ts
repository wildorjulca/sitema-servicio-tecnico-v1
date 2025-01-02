import { error } from "console";
import { Request, Response } from "express";
import { ResultSetHeader, RowDataPacket } from 'mysql2'
import jwt from "jsonwebtoken";
import { coneccion } from "../config/conexion";
import { createResponse } from "../utils/response";

const cn = coneccion()

export const verifyRutaAuthenticate = (req: Request, res: Response) => {

    try {
        const { token } = req.cookies
        if (!token) res.status(401).send({
            status: 401,
            mensaje: "Autorización denegada: ¡No hay token!"
        })
        jwt.verify(token, process.env.JWT_SECRET as string, async (error: any, user: any) => {
            if (error) res.status(401).send({
                status: 401,
                mensaje: "Tokem no valido"
            })
            const idTecnico = (req as any).user
            /// buscamos el id del user del token si el id es valido me va a devolver  el token
            // const idTecnico = "d7cd4ba3-d725-442b-a601-6f3496a0231c"
            const [result] = await cn.promise().query<[RowDataPacket[], ResultSetHeader]>("Call protected_routes(?)", [idTecnico])
            console.log(result[1])
            if (result[1].affectedRows === 1) {
                res.status(200).send({ status: 200, succes: true, mensaje: "Validacion exitosa authorizacion Permitida!" })
            } else {
                res.status(403).json(createResponse(403, false, "Autorización denegada: ID técnico inválido"));
            }

        })

    } catch (error) {
        console.error("Error en verifyRutaAuthenticate:", error);
        res.status(500).json(createResponse(500, false, "Error interno del servidor"));
    }

}