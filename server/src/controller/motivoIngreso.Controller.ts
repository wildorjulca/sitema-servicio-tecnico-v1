import { Request, Response } from "express";
import { createMotivo, deleteMotivo, listMotivoIngreso, updateMotivo } from "../service/motivo_ingreso.Service";
import { MotivoIngreso } from "../interface";

// ----------------------
// listar motivo ingreso
// ----------------------

const getAllMotivoIngresolCTRL = async (req: Request, res: Response) => {
    const usuarioId = Number(req.params.usuarioId) || 0;
    const pageIndex = Number(req.query.pageIndex) || 0; // opcional desde query
    const pageSize = Number(req.query.pageSize) || 10;   // opcional desde query

    const response = await listMotivoIngreso(usuarioId, pageIndex, pageSize);
    res.status(response.status).json(response);
};

// ----------------------
// Agregar motivo ingreso
// ----------------------
const addMotivoIngresoCTRL = async (req: Request, res: Response) => {
    const motivo: MotivoIngreso = {
        descripcion: req.body.descripcion,
        precio_cobrar: req.body.precio_cobrar ?? null, // puede ser nulo
        usuarioId: req.body.usuarioId
    };

    const response = await createMotivo(motivo);
    res.status(response.status).json(response);
};

// ----------------------
// Actualizar motivo ingreso
// ----------------------
const updateMotivoIngresoCTRL = async (req: Request, res: Response) => {
    const motivo: MotivoIngreso = {
        id: Number(req.body.id),
        descripcion: req.body.descripcion,
        precio_cobrar: req.body.precio_cobrar ?? null,
        usuarioId: req.body.usuarioId
    };

    const response = await updateMotivo(motivo);
    res.status(response.status).json(response);
};

// ----------------------
// Eliminar motivo ingreso
// ----------------------
const deleteMotivoIngresoCTRL = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const usuarioId = Number(req.body.usuarioId);

    const response = await deleteMotivo(id, usuarioId);
    res.status(response.status).json(response);
};

// exportamos los modulos 

export { getAllMotivoIngresolCTRL, addMotivoIngresoCTRL, updateMotivoIngresoCTRL, deleteMotivoIngresoCTRL }