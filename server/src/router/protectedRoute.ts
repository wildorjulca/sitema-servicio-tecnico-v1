import { Router } from "express";
import { verifyRutaAuthenticate } from "../controller/protecTedController";

const protectedRoute = Router()

protectedRoute.get("/rutaProtegida",verifyRutaAuthenticate)

export { protectedRoute}