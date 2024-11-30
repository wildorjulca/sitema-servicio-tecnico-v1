
import express from 'express'
import 'dotenv/config'
import { router } from './router/categoriaRouter'
import { routerEquipo } from './router/equipoRouter'
import { routerMarca } from './router/marcaRouter'
import { routerTipDocument } from './router/tipo_documentoRouter'

const PORT = process.env.PORT || 3001
const app = express()

// MIDLEWAR
app.use(express.json())
// RUTAS DE LOS ENPOINTS
app.use("/api/servicio", router)
app.use("/api/servicio", routerEquipo)
app.use("/api/servicio", routerMarca)
app.use("/api/servicio", routerMarca)
app.use("/api/servicio", routerTipDocument)





app.listen(PORT, () => {
    console.log("Servidor en ejecucion PORT:", PORT)
})