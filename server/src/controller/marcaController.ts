import { Request, Response } from "express";
import { newMarcaService } from "../service/marcaService";



const addMarcaCTRL = async (req: Request, res: Response) => {
    const response = await newMarcaService(req.body)
    res.status(response.status).send(response)
}

export { addMarcaCTRL }