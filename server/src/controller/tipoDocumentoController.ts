import { Request, Response } from "express";
import { newTipoDocumento } from "../service/tipoDocumentoService";


const addTipoDocumento = async (req: Request, res: Response) => {
    const response = await newTipoDocumento(req.body)
    res.status(response.status).send(response)
}

export { addTipoDocumento }