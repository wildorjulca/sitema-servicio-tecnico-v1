import { Request, Response } from 'express';
import { ConsultarServicioWeb } from '../service/consultaWeb.Service';

const consultaWebCTRL = async (req: Request, res: Response) => {
    const { codigoSeguimiento } = req.params; // O req.body según cómo lo envíes

    // Validar que venga el código de seguimiento
    if (!codigoSeguimiento) {
        return res.status(400).json({
            success: false,
            mensaje: "El código de seguimiento es requerido"
        });
    }

    const response = await ConsultarServicioWeb(codigoSeguimiento);
    res.status(response.status).json(response);
};

export { consultaWebCTRL };