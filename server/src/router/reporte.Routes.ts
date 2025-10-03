import { Router } from "express";
import {
  getReporteServiciosPeriodoCTRL,
  getAlertasInventarioCTRL,

} from "../controller/reportes.Controller";

const routerReportes = Router();

// Reportes principales
routerReportes.get("/servicios-periodo", getReporteServiciosPeriodoCTRL);
routerReportes.get("/alertas-inventario", getAlertasInventarioCTRL);


export { routerReportes };