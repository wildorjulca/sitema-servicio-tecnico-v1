import { body } from "express-validator";

export const ReglasValidacionMarca = [
    body("nombre")
        .trim()
        .not()
        .isEmpty()
        .withMessage("El campo 'marca' es obligatorio.")
        .isLength({ max: 50 })
        .withMessage("Campo 'marca' no puede superar los 50 caracteres.")
]