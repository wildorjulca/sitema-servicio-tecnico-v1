import { body } from "express-validator";

export const ReglasValidacionEquipo = [
  body("id")
    .optional() // Solo requerido para PUT
    .isInt()
    .withMessage("El ID del equipo debe ser un número entero"),
  body("nombreequipo")
    .trim()
    .not()
    .isEmpty()
    .withMessage("El campo 'nombre equipo' es obligatorio.")
    .isLength({ min: 1, max: 200 })
    .withMessage("El nombre del equipo debe tener entre 1 y 200 caracteres"),
  body("usuarioId")
    .isInt()
    .withMessage("El ID del usuario debe ser un número entero")
    .notEmpty()
    .withMessage("El ID del usuario es obligatorio"),
];
