import { Request, Response } from "express"
import { authservice } from "../service/authService"
import { generarToken } from "../utils/jwt"



const authLoginCTRL = async (req: Request, res: Response) => {
    const { usuario, password } = req.body

    const response = await authservice(usuario, password)
    if (response.success) {
        const token = await generarToken({ idTecnico: response.data })
        res.cookie("token", token, {
            maxAge: 24 * 60 * 60 * 1000, 
            httpOnly: true,
        })
        res.status(response.status).send(response)
        
    } else {
        res.status(response.status).send(response)
    }
}


export { authLoginCTRL }