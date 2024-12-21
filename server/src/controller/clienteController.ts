import { Request, Response } from "express"
import { getAllClienteService, newClienteService } from "../service/clienteService"



const addClienteCTRL = async (req: Request, res: Response) => {
    const response = await newClienteService(req.body)
    res.status(response.status).send(response)
}

const getAllClienteCTRL = async (req: Request, res: Response) => {
    const response = await getAllClienteService(req.params.filtro || '')
    res.status(response.status).send(response)
}

export { addClienteCTRL, getAllClienteCTRL }