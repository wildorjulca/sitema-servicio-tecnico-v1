import { Router } from 'express'
import { addTipoDocumento } from '../controller/tipoDocumentoController'

const routerTipDocument = Router()

routerTipDocument.post("/addTipoDocumento", addTipoDocumento)

export { routerTipDocument }