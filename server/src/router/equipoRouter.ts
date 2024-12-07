import {Router} from 'express'
import { addEquipoCTRL } from '../controller/equipoController'
import { ReglasValidacionEquipo } from '../validation/equipoValidation'
import { validate } from '../middlewares/validation'

const routerEquipo = Router()

routerEquipo.post("/addEquipo",ReglasValidacionEquipo,validate,  addEquipoCTRL)

export {routerEquipo}