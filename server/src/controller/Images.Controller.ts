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
            res.status(400).json({
                success: false,
                mensaje: "ID de producto inválido"
            });
        }

        const result = await listImagesClaud(Number(productoId));

        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: "Error interno del servidor"
        });
    }
};

// Subir imagen a un producto
export const subirImagenProducto = async (req: Request, res: Response) => {
    try {
        const { productoId, url, publicId } = req.body;

        // Validaciones
        if (!productoId || isNaN(Number(productoId))) {
            res.status(400).json({
                success: false,
                mensaje: "ID de producto inválido"
            });
        }

        if (!url || !publicId) {
            res.status(400).json({
                success: false,
                mensaje: "URL y publicId son requeridos"
            });
        }

        // Validar que la URL sea de Cloudinary
        if (!url.includes('cloudinary.com')) {
            res.status(400).json({
                success: false,
                mensaje: "URL debe ser de Cloudinary"
            });
        }

        const result = await insertImageClaud(Number(productoId), url, publicId);

        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: "Error interno del servidor"
        });
    }
};

// Eliminar imagen específica
export const eliminarImagen = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(Number(id))) {
            res.status(400).json({
                success: false,
                mensaje: "ID de imagen inválido"
            });
        }

        const result = await deleteImageClaud(Number(id));

        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: "Error interno del servidor"
        });
    }
};

// Obtener imagen por ID
export const obtenerImagen = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(Number(id))) {
            res.status(400).json({
                success: false,
                mensaje: "ID de imagen inválido"
            });
        }

        const result = await getImageById(Number(id));

        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: "Error interno del servidor"
        });
    }
};

// Eliminar todas las imágenes de un producto
export const eliminarTodasImagenesProducto = async (req: Request, res: Response) => {
    try {
        const { productoId } = req.params;

        if (!productoId || isNaN(Number(productoId))) {
            res.status(400).json({
                success: false,
                mensaje: "ID de producto inválido"
            });
        }

        const result = await deleteAllImagesByProduct(Number(productoId));

        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: "Error interno del servidor"
        });
    }
};

// Controlador para subir múltiples imágenes
export const subirMultiplesImagenes = async (req: Request, res: Response) => {
    try {
        const { productoId, imagenes } = req.body;

        // Validaciones
        if (!productoId || isNaN(Number(productoId))) {
            res.status(400).json({
                success: false,
                mensaje: "ID de producto inválido"
            });
        }

        if (!imagenes || !Array.isArray(imagenes) || imagenes.length === 0) {
            res.status(400).json({
                success: false,
                mensaje: "Array de imágenes es requerido"
            });
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

        res.status(201).json({
            success: true,
            mensaje: "Imágenes subidas correctamente",
            data: resultados
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: "Error interno del servidor"
        });
    }
};