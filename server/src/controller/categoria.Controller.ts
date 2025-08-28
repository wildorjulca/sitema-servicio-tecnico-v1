import { Request, Response } from "express";
import { createCat, deleteCat, listCat, updateCat } from "../service/categoria.Service";
import { Category } from "../interface";

// ----------------------
// listar categoria
// ----------------------

const getAllCatCTRL = async (req: Request, res: Response) => {
  const usuarioId = Number(req.params.usuarioId) || 0;
  const pageIndex = Number(req.query.pageIndex) || 0; // opcional desde query
  const pageSize = Number(req.query.pageSize) || 10;   // opcional desde query

  const response = await listCat(usuarioId, pageIndex, pageSize);
  res.status(response.status).json(response);
};


// ----------------------
// Agregar categoria
// ----------------------
const addCatCTRL = async (req: Request, res: Response) => {
    const motivo: Category = {
        descripcion: req.body.descripcion,
        esServicio: req.body.esServicio ?? null, // puede ser nulo
        usuarioId: req.body.usuarioId
    };

    const response = await createCat(motivo);
    res.status(response.status).json(response);
};

// ----------------------
// Actualizar categoria
// ----------------------
const updateCatCTRL = async (req: Request, res: Response) => {
    const motivo: Category = {
        id: Number(req.body.id),
        descripcion: req.body.descripcion,
        esServicio: req.body.esServicio ?? null,
        usuarioId: req.body.usuarioId
    };

    const response = await updateCat(motivo);
    res.status(response.status).json(response);
};

// ----------------------
// Eliminar categoria
// ----------------------
const deleteCatCTRL = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const usuarioId = Number(req.body.usuarioId);

    const response = await deleteCat(id, usuarioId);
    res.status(response.status).json(response);
};

// exportamos los modulos 

export { getAllCatCTRL, addCatCTRL ,updateCatCTRL, deleteCatCTRL}