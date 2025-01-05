import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authRequired = (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies;

    if (!token) {
        res.status(401).send({
            status: 401,
            mensaje: "Autorización denegada: ¡No hay token!",
        });
        return
    }
    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
        if (err) {
            res.status(401).send({
                status: 401,
                mensaje: "¡Token no válido!",
            });
            return
        }
        (req as any).user = user;
        console.log((req as any).user)

        next();
    });
};
