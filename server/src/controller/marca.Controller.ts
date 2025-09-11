import { Request, Response } from "express"
import { Brands } from "../interface"
import { createBrand, deleteBrand, listAllBrands, listBrands, updateBrand } from "../service/marca.Service"


// ----------------------
// Crear marca
// ----------------------
const addBrandCTRL = async (req: Request, res: Response) => {
    const marca: Brands = {
        nombre: req.body.nombre,
        usuarioId: req.body.usuarioId // asegúrate de enviar el id del usuario logueado
    }

    const response = await createBrand(marca)
    res.status(response.status).json(response)
}

// ----------------------
// Listar marcas
// ----------------------

const getAllBrandsCTRL = async (req: Request, res: Response) => {
  const usuarioId = Number(req.params.usuarioId) || 0;
  const pageIndex = Number(req.query.pageIndex) || 0; // opcional desde query
  const pageSize = Number(req.query.pageSize) || 10;   // opcional desde query

  const response = await listBrands(usuarioId, pageIndex, pageSize);
  res.status(response.status).json(response);
};

// ----------------------
// Actualizar marca
// ----------------------
const updateBrandCTRL = async (req: Request, res: Response) => {
    const marca: Brands = {
        id: Number(req.body.id),
        nombre: req.body.nombre,
        usuarioId: req.body.usuarioId // usuario que hace la acción
    }

    const response = await updateBrand(marca)
    res.status(response.status).json(response)
}

// ----------------------
// Eliminar marca
// ----------------------
const deleteBrandCTRL = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const usuarioId = Number(req.body.usuarioId) // usuario que hace la acción

    const response = await deleteBrand(id, usuarioId)
    res.status(response.status).json(response)
}


const ListMarcaCboCTRL = async (req: Request, res: Response) => {
    const response = await listAllBrands()
    res.status(response.status).json(response)
}

export { addBrandCTRL, getAllBrandsCTRL, updateBrandCTRL, deleteBrandCTRL, ListMarcaCboCTRL }
