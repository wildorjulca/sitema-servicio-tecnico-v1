import { Router } from 'express'
import { getAllTipoDocCTRL } from '../controller/tipoDocumento.Controller'

const routerTipDocument = Router()

routerTipDocument.post("/getAllDoc/:usuarioId", getAllTipoDocCTRL)

export { routerTipDocument }