import { Router } from "express";
import { createServicioEquipoCTRL, deleteServicioEquipoCTRL, getAllServicioEquipoCTRL, updateServicioEquipoCTRL } from "../controller/servicioEquipos.Controller";
import { getAllServicioCTRL, getEstadoCTRL } from "../controller/servicio.Controller";


const routerServicio = Router()

routerServicio.get("/getService/:usuarioId", getAllServicioCTRL),
routerServicio.get("/getEstado", getEstadoCTRL),
routerServicio.post("/AddServE", createServicioEquipoCTRL),
routerServicio.put("/updateServE", updateServicioEquipoCTRL),
routerServicio.delete("/deleteServE/:idServicioEquipos", deleteServicioEquipoCTRL)

export { routerServicio }