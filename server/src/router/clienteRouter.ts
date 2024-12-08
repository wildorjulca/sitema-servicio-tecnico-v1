import { Router } from 'express'
import { addClienteCTRL } from '../controller/clienteController'
import { ReglasValidacionCliente } from '../validation/clienteValidation'
import { validate } from '../middlewares/validation'

export { Router } from 'express'

const routerCliente = Router()

routerCliente.post("/addCliente", ReglasValidacionCliente, validate, addClienteCTRL)

export { routerCliente }