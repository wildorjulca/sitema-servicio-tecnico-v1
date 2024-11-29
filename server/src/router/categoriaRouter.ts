import { Router } from "express";
import { addCategoriaCTRL } from "../controller/categoriaControlle";

const router = Router()


router.post("/addCategoria", addCategoriaCTRL)


export { router }