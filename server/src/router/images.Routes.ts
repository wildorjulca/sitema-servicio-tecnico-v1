import express from 'express';
import { 
    eliminarImagen, 
    eliminarTodasImagenesProducto, 
    listarImagenesProducto, 
    obtenerImagen, 
    subirImagenProducto, 
    subirMultiplesImagenes 
} from '../controller/Images.Controller';

const routerImg = express.Router();

// Rutas para imágenes de productos
routerImg.get('/imgGet/:productoId', listarImagenesProducto);
routerImg.post('/img', subirImagenProducto);
routerImg.post('/upload/multiples', subirMultiplesImagenes);
routerImg.get('/imgs/:id', obtenerImagen);
routerImg.delete('/deleteImg/:id', eliminarImagen); // ← AGREGAR "/"
routerImg.delete('/imgdv/:productoId/all', eliminarTodasImagenesProducto);

export default routerImg;