import { Router } from 'express'
import { addClienteCTRL } from '../controller/clienteController'

export {Router} from 'express'

const routerCliente = Router()

routerCliente.post("/addCliente",addClienteCTRL)

export {routerCliente}