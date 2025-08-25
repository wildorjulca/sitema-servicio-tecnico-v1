import express from 'express';
import {  addProductCTRL, updateProductCTRL, deleteProductCTRL, getAllProductoCTRL } from '../controller/producto.Controller';
import { validate } from '../middlewares/validation';
import { ReglasValidacionProducto } from '../validation/productoValidation';

const routerProducto = express.Router();

// Listar todos los productos (paginación opcional vía query params)
routerProducto.get('/getAllProduc/:usuarioId', getAllProductoCTRL);

// Crear un nuevo producto
routerProducto.post('/productos', ReglasValidacionProducto, validate, addProductCTRL);

// Actualizar un producto existente
routerProducto.put('/productos/:id', ReglasValidacionProducto, validate, updateProductCTRL);

// Eliminar un producto
routerProducto.delete('/productos/:id', deleteProductCTRL);

export { routerProducto };