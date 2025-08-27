import { Router } from 'express'
import { ReglasValidacionCliente } from '../validation/clienteValidation'
import { validate } from '../middlewares/validation'
import { getAllClienteCTRL } from '../controller/cliente.Controller'

export { Router } from 'express'

const routerCliente = Router()

routerCliente.get("/getAllCliente/:usuarioId", getAllClienteCTRL )

export { routerCliente }