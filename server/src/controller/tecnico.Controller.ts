import { Request, Response } from "express"
import { tecnicoFiltre, estadisticas, listarTecnicos } from "../service/tecnico.Service"

export const tecnicoFiltreCTRL = async (req: Request, res: Response) => {
    try {
        const response = await tecnicoFiltre(req.body)

        if (response?.error) {
            res.status(response.status).json(response)
            return
        }

        // Para consultas exitosas usamos status 200
        if (response?.success) {
            res.status(response.status || 200).json(response)
            return
        }

        // Si no hay respuesta exitosa
        res.status(500).json({
            success: false,
            mensaje: "Error interno del servidor"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: "Error en el controlador",
            error: error
        })
    }
}

export const estadisticasCTRL = async (req: Request, res: Response) => {
    try {
        const response = await estadisticas(req.body)

        if (response?.error) {
            res.status(response.status).json(response)
            return
        }

        // Para consultas exitosas usamos status 200
        if (response?.success) {
            res.status(response.status || 200).json(response)
            return
        }

        // Si no hay respuesta exitosa
        res.status(500).json({
            success: false,
            mensaje: "Error interno del servidor"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: "Error en el controlador",
            error: error
        })
    }
}

export const listarTecnicosCTRL = async (req: Request, res: Response) => {
    try {
        const response = await listarTecnicos()

        if (response?.error) {
            res.status(response.status).json(response)
            return
        }

        res.status(response?.status || 200).json(response)

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: "Error en el controlador",
            error: error
        })
    }
}