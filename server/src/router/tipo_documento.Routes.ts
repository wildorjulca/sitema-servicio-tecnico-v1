import { Router } from 'express'
import { getAllTipoDocCTRL } from '../controller/tipoDocumento.Controller'

const routerTipDocument = Router()

routerTipDocument.get("/getAllDoc/:usuarioId", getAllTipoDocCTRL)

export { routerTipDocument }