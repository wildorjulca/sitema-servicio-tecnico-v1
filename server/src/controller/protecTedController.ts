import { error } from "console";
import { Request, Response } from "express";
import { ResultSetHeader, RowDataPacket } from 'mysql2'
import jwt from "jsonwebtoken";
import { coneccion } from "../config/conexion";
import { createResponse } from "../utils/response";

const cn = coneccion()

export const verifyRutaAuthenticate = (req: Request, res: Response) => {
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
        /// buscamos el id del user del token si el id es valido me va a devolver  el token
        const [result] = await cn.promise().query<[RowDataPacket[], ResultSetHeader]>("Call user_finUnique", [1])
        if (result[1].affectedRows === 1) {
            // createResponse()
        }

    })

}