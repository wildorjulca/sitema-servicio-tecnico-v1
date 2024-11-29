import { Request, Response } from "express";



const addCategoriaCTRL = (req: Request, res: Response): any => {
    return res.status(200).send({ status: 200, succes: true, mensaje: "GET correct!" })
}

export { addCategoriaCTRL }