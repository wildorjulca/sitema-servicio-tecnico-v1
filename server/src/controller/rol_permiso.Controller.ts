import { Request, Response } from 'express';
import { guardarPermisosRol, listarPermisosRol } from '../service/rol_permiso.Service';

// ✅ LISTAR PERMISOS DE UN ROL
export const listarPermisosRolCTRL = async (req: Request, res: Response) => {
    const { rol_id } = req.params;
    const { usuarioId } = req.body; // ✅ VIENE DEL FRONTEND

    try {
        if (!usuarioId) {
             res.status(401).json({
                success: false,
                mensaje: "Usuario no autenticado"
            });
            return
        }

        const rolId = parseInt(rol_id);
        if (isNaN(rolId) || rolId <= 0) {
             res.status(400).json({
                success: false,
                mensaje: "ID de rol no válido"
            });
            return
        }

        const response = await listarPermisosRol(rolId, usuarioId);

        res.status(response.status).json(response);
    } catch (error: any) {
        console.error('Error en controller listar permisos rol:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error interno del servidor",
            error: error.message
        });
    }
};

// ✅ GUARDAR PERMISOS DE UN ROL
export const guardarPermisosRolCTRL = async (req: Request, res: Response) => {
    const { rol_id, permisos, usuarioId } = req.body; // ✅ VIENE DEL FRONTEND

    try {
        if (!usuarioId) {
             res.status(401).json({
                success: false,
                mensaje: "Usuario no autenticado"
            });
            return
        }

        const rolId = parseInt(rol_id);
        if (isNaN(rolId) || rolId <= 0) {
             res.status(400).json({
                success: false,
                mensaje: "ID de rol no válido"
            });
            return
        }

        if (!Array.isArray(permisos)) {
             res.status(400).json({
                success: false,
                mensaje: "El formato de permisos no es válido"
            });
            return
        }

        const response = await guardarPermisosRol(rolId, usuarioId, permisos);

        res.status(response.status).json(response);
    } catch (error: any) {
        console.error('Error en controller guardar permisos rol:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error interno del servidor",
            error: error.message
        });
    }
};

export default {
    listarPermisosRolCTRL,
    guardarPermisosRolCTRL
};