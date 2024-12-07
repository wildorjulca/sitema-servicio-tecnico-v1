import { body } from "express-validator";

export const CategoryValidationRules = [
    body("descripcion")
        .trim()
        .not()
        .isEmpty()
        .withMessage("El campo 'descripcion' es obligatorio.")
        .isLength({ max: 45 })
        .withMessage("La 'descripcion' no puede superar los 45 caracteres.")
];
