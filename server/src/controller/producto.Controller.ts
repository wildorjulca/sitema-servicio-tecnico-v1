import { Request, Response } from "express"
import { createProduct, deleteProduct, listProduct, updateProduct } from "../service/producto.Service";
import { Producto } from "../interface";


// ----------------------
// Listar productos
// ----------------------

const getAllProductoCTRL = async (req: Request, res: Response) => {
  const usuarioId = Number(req.params.usuarioId) || 0;
  const pageIndex = Number(req.query.pageIndex) || 0; // opcional desde query
  const pageSize = Number(req.query.pageSize) || 10;   // opcional desde query

  const response = await listProduct(usuarioId, pageIndex, pageSize);
  res.status(response.status).json(response);
};


// ----------------------
// Registrar producto
// ----------------------
const addProductCTRL = async (req: Request, res: Response) => {
  try {
    const producto: Producto = {
      id: Number(req.body.id) || 0, // For updates, 0 for inserts
      nombre: req.body.nombre,
      descripcion: req.body.descripcion || null,
      precio_compra: Number(req.body.precio_compra),
      precio_venta: Number(req.body.precio_venta),
      stock: Number(req.body.stock) || 0,
      categoria_id: Number(req.body.categoria_id),
      usuarioId: Number(req.body.usuarioId),
    };

    const response = await createProduct(producto);
    res.status(response.status).json(response);
  } catch (error) {
    res.status(500).json({ status: 500, success: false, message: "Error al registrar producto", error });
  }
};

// ----------------------
// Actualizar producto
// ----------------------
const updateProductCTRL = async (req: Request, res: Response) => {
  try {
    const producto: Producto = {
      id: Number(req.body.id) || 0, // For updates, 0 for inserts
      nombre: req.body.nombre,
      descripcion: req.body.descripcion || null,
      precio_compra: Number(req.body.precio_compra),
      precio_venta: Number(req.body.precio_venta),
      stock: Number(req.body.stock) || 0,
      categoria_id: Number(req.body.categoria_id),
      usuarioId: Number(req.body.usuarioId),
    };

    const response = await updateProduct(producto);
    res.status(response.status).json(response);
  } catch (error) {
    res.status(500).json({ status: 500, success: false, message: "Error al actualizar producto", error });
  }
};

// ----------------------
// Eliminar producto
// ----------------------
const deleteProductCTRL = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const usuarioId = Number(req.body.usuarioId);

    const response = await deleteProduct(id, usuarioId);
    res.status(response.status).json(response);
  } catch (error) {
    res.status(500).json({ status: 500, success: false, message: "Error al eliminar producto", error });
  }
};

export { getAllProductoCTRL, addProductCTRL, updateProductCTRL, deleteProductCTRL }