import { Router } from "express";
import { agregarRepuestosSecretariaCTRL, buscarClienteServicioCTRL, buscarProducCTRL, eliminarRepuestosSecretariaCTRL, entregarServicioCTRL, finalizarReparacionCTRL, getAllServicioCTRL, getEstadoCTRL, getMot_IngresoCTRL, guardarAvanceTecnicoCTRL, iniciarReparacionCTRL, obtenerEquiposPorClienteCTRL, obtenerRepuestosServicioCTRL, pagarServicioCTRL, registrarServicioBasicoCTRL } from "../controller/servicio.Controller";
import { validate } from "../middlewares/validation";
import { validateActualizarReparacion, validateAgregarRepuestos, validateFinalizarReparacion, validateGuardarAvance, validateRegistroBasico } from "../validation/servicioValidation";


const routerServicio = Router()

routerServicio.get("/getService/:usuarioId", getAllServicioCTRL),
    routerServicio.get("/getEstado", getEstadoCTRL),
    routerServicio.get("/getMot_ing", getMot_IngresoCTRL),
    routerServicio.get("/filtroClient", buscarClienteServicioCTRL),
    routerServicio.get("/filtroP", buscarProducCTRL),
    routerServicio.get('/equipos-cliente', obtenerEquiposPorClienteCTRL);

    routerServicio.post('/registro-basico', validate, validateRegistroBasico(), registrarServicioBasicoCTRL);
    routerServicio.post('/iniciar-repare', iniciarReparacionCTRL);

    // Ruta para Guardar Avance (Técnico)
    routerServicio.put('/guardar-avance', validate, validateGuardarAvance(), guardarAvanceTecnicoCTRL);

    // Ruta para Agregar Repuestos (Secretaria)  
    routerServicio.post('/agregar-repuestos', validate, validateAgregarRepuestos(), agregarRepuestosSecretariaCTRL);
    routerServicio.delete('/delete-repuestos', eliminarRepuestosSecretariaCTRL);

    // Ruta para Finalizar Reparación (Técnico)
    routerServicio.put('/finalizar-reparacion', validate, validateFinalizarReparacion(), finalizarReparacionCTRL);

    routerServicio.get('/repuestos/:id', obtenerRepuestosServicioCTRL)

    // Ruta para el Paso 3 - Entregar servicio al cliente (Estado 4)
    routerServicio.put('/entregar-servicio', entregarServicioCTRL);

    routerServicio.put('/pay', pagarServicioCTRL);






export { routerServicio }