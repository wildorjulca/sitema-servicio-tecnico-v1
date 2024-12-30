import { Request, Response } from "express"
import { authservice } from "../service/authService"



const authLoginCTRL = async (req: Request, res: Response) => {
    const{ usuario, password} = req.body
    const response = await authservice(usuario, password)
    res.status(response.status).send(response)
}

export { authLoginCTRL }