import {Router} from 'express'
import { addEquipoCTRL } from '../controller/equipoController'

const routerEquipo = Router()

routerEquipo.post("/addEquipo",addEquipoCTRL)

export {routerEquipo}