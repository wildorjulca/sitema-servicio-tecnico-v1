import { Router } from "express";
import { getAllServicioEquipoCTRL } from "../controller/servicioEquipos.Controller";


const routerServicioEquipos = Router()

routerServicioEquipos.get("/addServicioEquipos/:usuarioId",getAllServicioEquipoCTRL)

export {routerServicioEquipos}