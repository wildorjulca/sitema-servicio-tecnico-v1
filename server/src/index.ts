
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import { router } from './router/categoriaRouter'
import { routerEquipo } from './router/equipoRouter'
import { routerMarca } from './router/marcaRouter'
import { routerTipDocument } from './router/tipo_documentoRouter'
import { routerCliente } from './router/clienteRouter'
import { routerMotivoIngreso } from './router/motivo_ingresoRouter'
import { routerServicioEquipos } from './router/servicio_equiposRouter'
import { routerTecnico } from './router/tecnicoRouter'
import { routerLogin } from './router/authRouter'
import { protectedRoute } from './router/protectedRoute'
import { routerProducto } from './router/productoRouter'
const PORT = process.env.PORT || 3001
const app = express()


// MIDLEWAR
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
// RUTAS DE LOS ENPOINTS
app.use("/api/servicio", router)
app.use("/api/servicio", routerProducto)
app.use("/api/servicio", routerEquipo)
app.use("/api/servicio", routerMarca)
app.use("/api/servicio", routerMarca)
app.use("/api/servicio", routerTipDocument)
app.use("/api/servicio", routerCliente)
app.use("/api/servicio", routerMotivoIngreso)
app.use("/api/servicio", routerServicioEquipos)
app.use("/api/servicio", routerTecnico)
app.use("/api/servicio", routerLogin)
app.use("/api/servicio", protectedRoute)








app.listen(PORT, () => {
    console.log("Servidor en ejecucion PORT:", PORT)
})