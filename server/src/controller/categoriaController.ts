import { Request, Response } from "express";
import { createCategoria } from "../service/categoriaService";



const addCategoriaCTRL =async (req: Request, res: Response):Promise<any> => {
    const response  = await createCategoria(req.body)
    return res.status(response.status).send(response)
}

export { addCategoriaCTRL }