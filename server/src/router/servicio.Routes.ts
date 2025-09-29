import { Router } from "express";
import { actualizarServicioReparacionCTRL, buscarClienteServicioCTRL, buscarProducCTRL, entregarServicioCTRL, getAllServicioCTRL, getEstadoCTRL, getMot_IngresoCTRL, iniciarReparacionCTRL, obtenerEquiposPorClienteCTRL, registrarServicioBasicoCTRL } from "../controller/servicio.Controller";
import { validate } from "../middlewares/validation";
import { validateActualizarReparacion, validateRegistroBasico } from "../validation/servicioValidation";


const routerServicio = Router()

routerServicio.get("/getService/:usuarioId", getAllServicioCTRL),
    routerServicio.get("/getEstado", getEstadoCTRL),
    routerServicio.get("/getMot_ing", getMot_IngresoCTRL),
    routerServicio.get("/filtroClient", buscarClienteServicioCTRL),
    routerServicio.get("/filtroP", buscarProducCTRL),
    routerServicio.get('/equipos-cliente', obtenerEquiposPorClienteCTRL);

routerServicio.post('/registro-basico', validate, validateRegistroBasico(), registrarServicioBasicoCTRL);
routerServicio.post('/iniciar-repare', iniciarReparacionCTRL);

// Ruta para el Paso 2 - Actualizar reparación (Estado 2 o 3)
routerServicio.put('/actualizar-reparacion', validate, validateActualizarReparacion(), actualizarServicioReparacionCTRL);


// Ruta para el Paso 3 - Entregar servicio al cliente (Estado 4)
routerServicio.put('/entregar-servicio', entregarServicioCTRL);





export { routerServicio }