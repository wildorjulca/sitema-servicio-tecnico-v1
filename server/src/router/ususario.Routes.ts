import { Router } from 'express'
import { createUserCTRL, deleteUserCTRL, getAllUserCTRL, updateUserCTRL } from '../controller/usuario.Controller'
import { validate } from '../middlewares/validation'
import { ReglasValidacionUsuario } from '../validation/usuarioValidation'

const routerUsuario = Router()

routerUsuario.get("/getUser/:usuarioId", getAllUserCTRL)
routerUsuario.post("/user-add", ReglasValidacionUsuario, validate, createUserCTRL) // ← Validación antes del middleware validate
routerUsuario.put("/userEdit/:id", updateUserCTRL) // ← Mismo orden
routerUsuario.delete("/user-delete/:id", deleteUserCTRL)

export { routerUsuario }