import { Request, Response } from "express";
import {
    reporteServiciosPeriodo,
    alertasInventario,
} from "../service/reportes.Service";

// Reporte por periodo
const getReporteServiciosPeriodoCTRL = async (req: Request, res: Response) => {
    try {
        const { tipoPeriodo, fechaBase } = req.query;

        if (!tipoPeriodo || !fechaBase) {
            res.status(400).json({
                status: 400,
                success: false,
                mensaje: "Los parámetros 'tipoPeriodo' y 'fechaBase' son requeridos"
            });
            return;
        }

        const response = await reporteServiciosPeriodo(
            tipoPeriodo as string,
            fechaBase as string
        );

        res.status(response.status).json(response);
    } catch (error: any) {
        console.error("Error en controlador reporte servicios periodo:", error);
        res.status(500).json({
            status: 500,
            success: false,
            mensaje: "Error interno del servidor",
            error: error.message
        });
    }
};

// Alertas de inventario
const getAlertasInventarioCTRL = async (req: Request, res: Response) => {
    try {
        const response = await alertasInventario();

        res.status(response.status).json(response);
    } catch (error: any) {
        console.error("Error en controlador alertas inventario:", error);
        res.status(500).json({
            status: 500,
            success: false,
            mensaje: "Error interno del servidor",
            error: error.message
        });
    }
};





export {
    getReporteServiciosPeriodoCTRL,
    getAlertasInventarioCTRL,
};