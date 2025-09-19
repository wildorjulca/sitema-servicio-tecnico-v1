import { Router } from "express";
import { actualizarServicioReparacionCTRL, buscarClienteServicioCTRL, entregarServicioCTRL, getAllServicioCTRL, getEstadoCTRL, obtenerEquiposPorClienteCTRL, registrarServicioBasicoCTRL } from "../controller/servicio.Controller";
import { validate } from "../middlewares/validation";
import { validateActualizarReparacion, validateRegistroBasico } from "../validation/servicioValidation";


const routerServicio = Router()

    routerServicio.get("/getService/:usuarioId", getAllServicioCTRL),
    routerServicio.get("/getEstado", getEstadoCTRL),
    routerServicio.get("/filtroClient", buscarClienteServicioCTRL),
    routerServicio.get('/equipos-cliente', obtenerEquiposPorClienteCTRL);

    routerServicio.post('/registro-basico', validate, validateRegistroBasico(), registrarServicioBasicoCTRL);

    // Ruta para el Paso 2 - Actualizar reparación (Estado 2 o 3)
    routerServicio.put('/actualizar-reparacion', validate, validateActualizarReparacion(), actualizarServicioReparacionCTRL);


    // Ruta para el Paso 3 - Entregar servicio al cliente (Estado 4)
    routerServicio.put('/entregar-servicio', entregarServicioCTRL);

export { routerServicio }