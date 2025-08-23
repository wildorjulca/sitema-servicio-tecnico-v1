import { Router } from "express";
import { ReglasValidacionEquipo } from "../validation/equipoValidation";
import { validate } from "../middlewares/validation";
import { addEquipoCTRL, deleteEquipoCTRL, getAllEquiposCTRL, updateEquipoCTRL } from "../controller/equipo.Controller";

const routerEquipo = Router();

// Crear equipo
routerEquipo.post("/addEquipo", ReglasValidacionEquipo, validate, addEquipoCTRL);

// Listar equipos
// Puedes pasar usuarioId por params o extraerlo del token en middleware
routerEquipo.get("/getEquipo/:usuarioId", getAllEquiposCTRL);

// Actualizar equipo
routerEquipo.put("/updateEquipo", ReglasValidacionEquipo, validate, updateEquipoCTRL);

// Eliminar equipo
routerEquipo.delete("/deleteEquipo/:id", deleteEquipoCTRL);

export { routerEquipo };