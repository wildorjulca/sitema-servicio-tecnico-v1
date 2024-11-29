
import express from 'express'
import 'dotenv/config'
import { router } from './router/categoriaRouter'

const PORT = process.env.PORT || 3001
const app = express()

// RUTAS DE LOS ENPOINTS
app.use("/api/servicio", router)

app.listen(PORT, () => {
    console.log("Servidor en ejecucion PORT:", PORT)
})