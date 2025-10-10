import { Request, Response } from 'express';
import {
    listImagesClaud,
    insertImageClaud,
    deleteImageClaud,
    getImageById,
    deleteAllImagesByProduct
} from '../service/productoImagen.service';

// Listar imágenes de un producto
export const listarImagenesProducto = async (req: Request, res: Response) => {
    try {
        const { productoId } = req.params;

        if (!productoId || isNaN(Number(productoId))) {
            res.status(400).json({ // ← AGREGAR return
                success: false,
                mensaje: "ID de producto inválido"
            });
            return;
        }

        const result = await listImagesClaud(Number(productoId));

        res.status(result.status).json(result); return // ← AGREGAR return
    } catch (error) {
        res.status(500).json({ // ← AGREGAR return
            success: false,
            mensaje: "Error interno del servidor"
        });
        return
    }
};

// Subir imagen a un producto
export const subirImagenProducto = async (req: Request, res: Response) => {
    try {
        const { productoId, url, publicId } = req.body;

        // Validaciones
        if (!productoId || isNaN(Number(productoId))) {
            res.status(400).json({ // ← AGREGAR return
                success: false,
                mensaje: "ID de producto inválido"
            });
            return
        }

        if (!url || !publicId) {
            res.status(400).json({ // ← AGREGAR return
                success: false,
                mensaje: "URL y publicId son requeridos"
            });
            return
        }

        // Validar que la URL sea de Cloudinary
        if (!url.includes('cloudinary.com')) {
            res.status(400).json({ // ← AGREGAR return
                success: false,
                mensaje: "URL debe ser de Cloudinary"
            });
            return
        }

        const result = await insertImageClaud(Number(productoId), url, publicId);

        res.status(result.status).json(result); return // ← AGREGAR return
    } catch (error) {
        res.status(500).json({ // ← AGREGAR return
            success: false,
            mensaje: "Error interno del servidor"
        });
        return
    }
};

// Eliminar imagen específica
export const eliminarImagen = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(Number(id))) {
            res.status(400).json({ // ← AGREGAR return
                success: false,
                mensaje: "ID de imagen inválido"
            }); return
        }

        const result = await deleteImageClaud(Number(id));

        res.status(result.status).json(result); return // ← AGREGAR return
    } catch (error) {
        res.status(500).json({ // ← AGREGAR return
            success: false,
            mensaje: "Error interno del servidor"
        }); return
    }
};

// Obtener imagen por ID
export const obtenerImagen = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(Number(id))) {
            res.status(400).json({ // ← AGREGAR return
                success: false,
                mensaje: "ID de imagen inválido"
            }); return
        }

        const result = await getImageById(Number(id));

        res.status(result.status).json(result); return // ← AGREGAR return
    } catch (error) {
        res.status(500).json({ // ← AGREGAR return
            success: false,
            mensaje: "Error interno del servidor"
        }); return
    }
};

// Eliminar todas las imágenes de un producto
export const eliminarTodasImagenesProducto = async (req: Request, res: Response) => {
    try {
        const { productoId } = req.params;

        if (!productoId || isNaN(Number(productoId))) {
            res.status(400).json({ // ← AGREGAR return
                success: false,
                mensaje: "ID de producto inválido"
            }); return
        }

        const result = await deleteAllImagesByProduct(Number(productoId));

        res.status(result.status).json(result); return // ← AGREGAR return
    } catch (error) {
        res.status(500).json({ // ← AGREGAR return
            success: false,
            mensaje: "Error interno del servidor"
        }); return
    }
};

// Controlador para subir múltiples imágenes
export const subirMultiplesImagenes = async (req: Request, res: Response) => {
    try {
        const { productoId, imagenes } = req.body;

        // Validaciones
        if (!productoId || isNaN(Number(productoId))) {
            res.status(400).json({ // ← AGREGAR return
                success: false,
                mensaje: "ID de producto inválido"
            }); return
        }

        if (!imagenes || !Array.isArray(imagenes) || imagenes.length === 0) {
            res.status(400).json({ // ← AGREGAR return
                success: false,
                mensaje: "Array de imágenes es requerido"
            }); return
        }

        // Subir cada imagen
        const resultados = [];
        for (const imagen of imagenes) {
            if (!imagen.url || !imagen.publicId) {
                continue; // Saltar imágenes inválidas
            }

            const result = await insertImageClaud(
                Number(productoId),
                imagen.url,
                imagen.publicId
            );

            resultados.push(result);
        }

        res.status(201).json({ // ← AGREGAR return
            success: true,
            mensaje: "Imágenes subidas correctamente",
            data: resultados
        }); return
    } catch (error) {
        res.status(500).json({ // ← AGREGAR return
            success: false,
            mensaje: "Error interno del servidor"
        }); return
    }
};