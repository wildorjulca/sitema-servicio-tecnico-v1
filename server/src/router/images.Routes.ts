import express from 'express';
import { eliminarImagen, eliminarTodasImagenesProducto, listarImagenesProducto, obtenerImagen, subirImagenProducto, subirMultiplesImagenes } from '../controller/Images.Controller';


const routerImg = express.Router();

// Rutas para imágenes de productos
routerImg.get('/imgGet/:productoId', listarImagenesProducto);
routerImg.post('/img', subirImagenProducto);
routerImg.post('/img/multiples', subirMultiplesImagenes);
routerImg.get('/imgs/:id', obtenerImagen);
routerImg.delete('deleteImg/:id', eliminarImagen);
routerImg.delete('/imgdv/:productoId/todas', eliminarTodasImagenesProducto);

export default routerImg;