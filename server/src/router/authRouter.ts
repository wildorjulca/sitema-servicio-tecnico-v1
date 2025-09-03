import { Router, Request, Response } from "express";
import { authLoginCTRL } from "../controller/auth.Controller";
import { authRequired } from "../middlewares/verifyToken";

const routerLogin = Router()

routerLogin.post("/login", authLoginCTRL)
routerLogin.post("/profile", authRequired, (req: Request, res: Response) => {
    console.log((req as any).user);
    res.status(200).send({ status: 200, mensaje: "Paso validacion" })
})
export { routerLogin } 