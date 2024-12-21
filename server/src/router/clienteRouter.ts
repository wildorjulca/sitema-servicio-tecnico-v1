import { Router } from 'express'
import { addClienteCTRL, getAllClienteCTRL } from '../controller/clienteController'
import { ReglasValidacionCliente } from '../validation/clienteValidation'
import { validate } from '../middlewares/validation'

export { Router } from 'express'

const routerCliente = Router()

routerCliente.post("/addCliente", ReglasValidacionCliente, validate, addClienteCTRL)
routerCliente.get("/getAllCliente/:filtro?", getAllClienteCTRL)

export { routerCliente }