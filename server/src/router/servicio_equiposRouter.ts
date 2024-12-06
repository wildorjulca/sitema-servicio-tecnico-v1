import { Router } from "express";
import { addServicioEquiposCTRL } from "../controller/servicioEquiposController";


const routerServicioEquipos = Router()

routerServicioEquipos.post("/addServicioEquipos",addServicioEquiposCTRL)

export {routerServicioEquipos}