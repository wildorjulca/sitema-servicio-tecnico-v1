import { Router } from "express";
import { createServicioEquipoCTRL, deleteServicioEquipoCTRL, getAllServicioEquipoCTRL, updateServicioEquipoCTRL } from "../controller/servicioEquipos.Controller";


const routerServicioEquipos = Router()

routerServicioEquipos.get("/addServicioEquipos/:usuarioId", getAllServicioEquipoCTRL),
routerServicioEquipos.post("/AddServE", createServicioEquipoCTRL),
routerServicioEquipos.put("/updateServE", updateServicioEquipoCTRL),
routerServicioEquipos.delete("/deleteServE/:idServicioEquipos", deleteServicioEquipoCTRL)

export { routerServicioEquipos }