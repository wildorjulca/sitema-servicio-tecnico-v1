import { Router } from 'express'
import { ReglasValidacionCliente } from '../validation/clienteValidation'
import { validate } from '../middlewares/validation'
import { addClienteCTRL, deleteClienteCTRL, getAllClienteCTRL, updateClienteCTRL } from '../controller/cliente.Controller'

export { Router } from 'express'

const routerCliente = Router()

routerCliente.get("/getAllCliente/:usuarioId", getAllClienteCTRL ),
routerCliente.post("/addCli", validate, ReglasValidacionCliente, addClienteCTRL ),
routerCliente.put("/updateCli", validate, ReglasValidacionCliente, updateClienteCTRL ),
routerCliente.delete("/deleteCli/:id", deleteClienteCTRL )

export { routerCliente }