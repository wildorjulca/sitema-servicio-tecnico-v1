import {Router} from 'express'
import { addMotivoIngresoCTRL, deleteMotivoIngresoCTRL, getAllMotivoIngresolCTRL, updateMotivoIngresoCTRL } from '../controller/motivoIngreso.Controller'
import { validate } from '../middlewares/validation'
import { ReglasValidacionMotivoIngreso } from '../validation/motivoIngresoValidation'
const routerMotivoIngreso = Router()


routerMotivoIngreso.get("/addMotivoIngreso/:usuarioId",getAllMotivoIngresolCTRL)
routerMotivoIngreso.post("/addMotivo", validate, ReglasValidacionMotivoIngreso, addMotivoIngresoCTRL)
routerMotivoIngreso.put("/updateMotivo",validate, ReglasValidacionMotivoIngreso, updateMotivoIngresoCTRL)
routerMotivoIngreso.delete("/deleteMotivo/:id",deleteMotivoIngresoCTRL)

export { routerMotivoIngreso}