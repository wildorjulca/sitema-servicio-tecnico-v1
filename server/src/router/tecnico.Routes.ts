import { Router } from 'express'
import { estadisticasCTRL, listarTecnicosCTRL, tecnicoFiltreCTRL } from '../controller/tecnico.Controller'


const routerTecnico = Router()

routerTecnico.post("/tecnicoF", tecnicoFiltreCTRL)
routerTecnico.post("/estadisticaT", estadisticasCTRL)
routerTecnico.get("/lista", listarTecnicosCTRL)

export { routerTecnico }