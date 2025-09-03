import { Router } from 'express'
import { getAllUserCTRL } from '../controller/usuario.Controller'

const routerUsuario = Router()

routerUsuario.get("/getUser/:usuarioId", getAllUserCTRL)

export { routerUsuario }