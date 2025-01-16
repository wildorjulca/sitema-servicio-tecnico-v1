import express from 'express'
import { addProductCTRL } from '../controller/productoContoller'

const routerProducto = express.Router()

routerProducto.post("/addProducto",addProductCTRL)


export {  routerProducto}