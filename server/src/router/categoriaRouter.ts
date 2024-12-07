import { Router } from "express";
import { addCategoriaCTRL } from "../controller/categoriaController";
import { CategoryValidationRules } from "../validation/categoriaValidation";
import { validate } from "../middlewares/validation";

const router = Router()

router.post("/addCategoria",CategoryValidationRules,validate, addCategoriaCTRL)
export { router }