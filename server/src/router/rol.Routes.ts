import { Router } from 'express'
import { getAllRolCTRL } from '../controller/rol.Controller'

const routerRol = Router()

routerRol.get("/getAllRol/:usuarioId", getAllRolCTRL)

export { routerRol }