import { body } from "express-validator";


export const ReglasValidacionEquipo = [
    body("nombreequipo")
        .trim()
        .not()
        .isEmpty()
        .withMessage("El campo 'nombre equipo' es obligatorio.")
        .isLength({ max: 45 })
        .withMessage("No puede superar los 45 caracteres.")
]