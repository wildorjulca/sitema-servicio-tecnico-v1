import { error } from "console";
import { Request, Response } from "express";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import jwt from "jsonwebtoken";
import { coneccion } from "../config/conexion";
import { createResponse } from "../utils/response";

const cn = coneccion();

export const verifyRutaAuthenticate = (req: Request, res: Response) => {
    try {
        const { token } = req.cookies;
        if (!token)
            res.status(401).send({
                status: 401,
                mensaje: "Autorización denegada: ¡No hay token!",
            });

        jwt.verify(token, process.env.JWT_SECRET as string, async (error: any, user: any) => {
            if (error)
                res.status(401).send({
                    status: 401,
                    mensaje: "Token no válido",
                });

            const idTecnico = (user as any).idTecnico;

            // Ejecutar el procedimiento almacenado
            const [result] = await cn.promise().query<RowDataPacket[]>("CALL protected_routes(?)", [idTecnico]);

            if (result[0].length > 0) {
                // Devuelve los datos completos del técnico en la respuesta
                const tecnico = result[0][0]; // Primer registro encontrado (debería ser único)
                res.status(200).send({
                    status: 200,
                    succes: true,
                    mensaje: "Validación exitosa. Autorización permitida.",
                    tecnico, // Aquí enviamos los datos del técnico
                });
            } else {
                res.status(403).json(createResponse(403, false, "Autorización denegada: ID técnico inválido"));
            }
        });
    } catch (error) {
        console.error("Error en verifyRutaAuthenticate:", error);
        res.status(500).json(createResponse(500, false, "Error interno del servidor"));
    }
};
