import { body } from "express-validator";

export const ReglasValidacionMotivoIngreso = [
    body("descripcion")
        .trim()
        .notEmpty()
        .withMessage("El campo 'descripcion' es obligatorio.")
        .isLength({ max: 100 })
        .withMessage("El campo 'descripcion' no puede superar los 100 caracteres."),

    body("precio_cobrar")
        .optional({ nullable: true }) // puede venir nulo o no enviado
        .isFloat({ min: 0 })
        .withMessage("El campo 'precio_cobrar' debe ser un número positivo.")
];
