import { Router } from "express"

import { ReglasValidacionMarca } from "../validation/marcaValidation"
import { validate } from "../middlewares/validation"
import { addBrandCTRL, deleteBrandCTRL, getAllBrandsCTRL, ListMarcaCboCTRL, updateBrandCTRL } from "../controller/marca.Controller"

const routerMarca = Router()

// Crear marca
routerMarca.post("/addMarca", ReglasValidacionMarca, validate, addBrandCTRL)

// Listar marcas
// Puedes pasar usuarioId por params o extraerlo del token en middleware
routerMarca.get("/getAll/:usuarioId", getAllBrandsCTRL)
routerMarca.get("/getMarca", ListMarcaCboCTRL)

// Actualizar marca
routerMarca.put("/updateMarca", ReglasValidacionMarca, validate, updateBrandCTRL)

// Eliminar marca
routerMarca.delete("/deleteMarca/:id", deleteBrandCTRL)

export { routerMarca }
