import { Router } from 'express'
import { addCatCTRL, deleteCatCTRL, getAllCatCTRL, updateCatCTRL } from '../controller/categoria.Controller'
import { validate } from '../middlewares/validation'
import { CategoryValidationRules } from '../validation/categoriaValidation'

const routerCat = Router()

routerCat.get("/getAllCat/:usuarioId", getAllCatCTRL),
routerCat.post("/addCat", validate,CategoryValidationRules, addCatCTRL),
routerCat.put("/updateCat",validate, CategoryValidationRules, updateCatCTRL),
routerCat.delete("/deleteCat/:id",deleteCatCTRL)

export { routerCat }