import { Request, Response } from "express";
import { newServicioEquipos } from "../service/servicio_equiposService";


const addServicioEquiposCTRL = async (req: Request, res: Response) => {
    try {
        const response = await newServicioEquipos(req.body)
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

export { addServicioEquiposCTRL }