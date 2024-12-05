import { Request, Response } from "express"
import { newMotivo_ingreso } from "../service/motivo_ingresoService"


const addMotivo_ingresoCTRL = async (req: Request, res: Response) => {

    try {
        const response = await newMotivo_ingreso(req.body)
        res.status(response.status).send(response)
    } catch (error: any) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Error en el servidor",
            error: error.message || error
        });
    }

}
export { addMotivo_ingresoCTRL }