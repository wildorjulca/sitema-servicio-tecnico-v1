import {Router} from 'express'
import { addMotivo_ingresoCTRL } from '../controller/motivoIngreso'
const routerMotivoIngreso = Router()


routerMotivoIngreso.post("/addMotivoIngreso",addMotivo_ingresoCTRL)