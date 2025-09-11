import { Request, Response } from "express";
import { Equipo } from "../interface";
import { createEquipo, deleteEquipo, listAllEquipos, listEquipos, updateEquipo } from "../service/equipo.Service";

// ----------------------
// Crear equipo
// ----------------------
const addEquipoCTRL = async (req: Request, res: Response) => {
    const equipo: Equipo = {
        nombreequipo: req.body.nombreequipo,
        usuarioId: req.body.usuarioId // asegúrate de enviar el id del usuario logueado
    };

    const response = await createEquipo(equipo);
    res.status(response.status).json(response);
};

// ----------------------
// Listar equipos
// ----------------------
const getAllEquiposCTRL = async (req: Request, res: Response) => {
    const usuarioId = Number(req.params.usuarioId) || 0;
    const pageIndex = Number(req.query.pageIndex) || 0; // opcional desde query
    const pageSize = Number(req.query.pageSize) || 10; // opcional desde query

    const response = await listEquipos(usuarioId, pageIndex, pageSize);
    res.status(response.status).json(response);
};

// ----------------------
// Actualizar equipo
// ----------------------
const updateEquipoCTRL = async (req: Request, res: Response) => {
    const equipo: Equipo = {
        id: Number(req.body.id),
        nombreequipo: req.body.nombreequipo,
        usuarioId: req.body.usuarioId // usuario que hace la acción
    };

    const response = await updateEquipo(equipo);
    res.status(response.status).json(response);
};

// ----------------------
// Eliminar equipo
// ----------------------
const deleteEquipoCTRL = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const usuarioId = Number(req.body.usuarioId); // usuario que hace la acción

    const response = await deleteEquipo(id, usuarioId);
    res.status(response.status).json(response);
};


const ListEquipoCboCTRL = async (req: Request, res: Response) => {
    const response = await listAllEquipos()
    res.status(response.status).json(response)
}

export { addEquipoCTRL, getAllEquiposCTRL, updateEquipoCTRL, deleteEquipoCTRL ,ListEquipoCboCTRL};