import { Router } from "express";
import { authLoginCTRL } from "../controller/authController";

const routerLogin = Router()

routerLogin.post("/login", authLoginCTRL)

export { routerLogin} 