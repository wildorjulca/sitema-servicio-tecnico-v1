import { Router } from 'express'
import { addMarcaCTRL } from '../controller/marcaController'
import { ReglasValidacionMarca } from '../validation/marcaValidation'
import { validate } from '../middlewares/validation'

const routerMarca = Router()

routerMarca.post("/addMarca",ReglasValidacionMarca, validate, addMarcaCTRL)

export { routerMarca }