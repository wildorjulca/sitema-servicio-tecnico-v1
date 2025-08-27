import { Router } from 'express'
import { getAllPermisoCTRL } from '../controller/permiso.Controller'

const routerPermisos = Router()

routerPermisos.get("/getAllPermiso/:usuarioId", getAllPermisoCTRL)

export { routerPermisos }