import { Request, Response } from "express"
import { newEquipoService } from "../service/equipoService"

const addEquipoCTRL = async (req: Request, res: Response): Promise<any> => {
    const response = await newEquipoService(req.body)
    return res.status(response.status).send(response)
}

export { addEquipoCTRL }