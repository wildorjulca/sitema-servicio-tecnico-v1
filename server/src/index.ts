
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import { routerEquipo } from './router/equipo.Routes'
import { routerMarca } from './router/marca.Routes'
import { routerTipDocument } from './router/tipo_documento.Routes'
import { routerCliente } from './router/cliente.Routes'
import { routerMotivoIngreso } from './router/motivo_ingreso.Routes'
import { routerServicioEquipos } from './router/servicio_equipos.Routes'
import { routerTecnico } from './router/tecnicoRouter'
import { routerLogin } from './router/authRouter'
import { protectedRoute } from './router/protectedRoute'
import { routerProducto } from './router/producto.Routes'
import { routerPermisos } from './router/permiso.Routes'
import { routerRol } from './router/rol.Routes'
import { routerCat } from './router/categoria.Routes'
import { routerUsuario } from './router/ususario.Routes'
import routerImg from './router/images.Routes'
import { routerServicio } from './router/servicio.Routes'
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
app.use("/api/servicio", routerCat)
app.use("/api/servicio", routerProducto)
app.use("/api/servicio", routerEquipo)
app.use("/api/servicio", routerMarca)
app.use("/api/servicio", routerTipDocument)
app.use("/api/servicio", routerCliente)
app.use("/api/servicio", routerMotivoIngreso)
app.use("/api/servicio", routerServicioEquipos)
app.use("/api/servicio", routerTecnico)
app.use("/api/servicio", routerLogin)
app.use("/api/servicio", protectedRoute)
app.use("/api/servicio", routerPermisos)
app.use("/api/servicio", routerPermisos)
app.use("/api/servicio", routerRol)
app.use("/api/servicio", routerUsuario)
app.use("/api/servicio", routerImg)
app.use("/api/servicio", routerServicio)








app.listen(PORT, () => {
    console.log("Servidor en ejecucion PORT:", PORT)
})