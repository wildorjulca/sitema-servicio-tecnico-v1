import { Router } from 'express'
import { addUsuarioCTRL } from '../controller/tecnicoController'


const routerTecnico = Router()

routerTecnico.post("/addTecnico", addUsuarioCTRL)

export { routerTecnico }