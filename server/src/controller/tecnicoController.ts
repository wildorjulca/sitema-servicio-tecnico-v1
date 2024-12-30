import { Request, response, Response } from "express"
import { registerUser } from "../service/tecnicoService"
import { generarToken } from "../utils/jwt"


export const addUsuarioCTRL = async (req: Request, res: Response) => {
    const response = await registerUser(req.body)
    if (response?.error) {
        res.status(response.status).send(response)
    }
    if (response?.status === 201) {
        const token = await generarToken({ idUsuario: response.idUsuario })
        res.cookie("token", token, {
            maxAge: 24 * 60 * 60 * 1000, // 1 día en milisegundos
            httpOnly: true,
        });
        res.status(response.status).send(response)
    }
}  