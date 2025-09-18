import { Router } from "express";
import { actualizarServicioReparacionCTRL, buscarClienteServicioCTRL, entregarServicioCTRL, getAllServicioCTRL, getEstadoCTRL, registrarServicioBasicoCTRL } from "../controller/servicio.Controller";


const routerServicio = Router()

routerServicio.get("/getService/:usuarioId", getAllServicioCTRL),
routerServicio.get("/getEstado", getEstadoCTRL),
routerServicio.get("/filtroClient", buscarClienteServicioCTRL),

routerServicio.post('/registro-basico', registrarServicioBasicoCTRL);

// Ruta para el Paso 2 - Actualizar reparación (Estado 2 o 3)
routerServicio.put('/actualizar-reparacion', actualizarServicioReparacionCTRL);

// Ruta para el Paso 3 - Entregar servicio al cliente (Estado 4)
routerServicio.put('/entregar-servicio', entregarServicioCTRL);

export { routerServicio }