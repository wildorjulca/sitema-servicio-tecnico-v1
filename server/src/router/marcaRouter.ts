import { Router } from 'express'
import { addMarcaCTRL } from '../controller/marcaController'

const routerMarca = Router()

routerMarca.post("/addMarca", addMarcaCTRL)

export { routerMarca }