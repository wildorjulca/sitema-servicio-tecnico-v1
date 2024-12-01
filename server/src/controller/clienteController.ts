import { Request, Response } from "express"
import { newClienteService } from "../service/clienteService"



const addClienteCTRL = async (req: Request, res: Response) => {
    const response = await newClienteService(req.body)
    res.status(response.status).send(response)
}

export { addClienteCTRL }