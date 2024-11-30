import { Router } from "express";
import { addCategoriaCTRL } from "../controller/categoriaController";

const router = Router()


router.post("/addCategoria", addCategoriaCTRL)


export { router }