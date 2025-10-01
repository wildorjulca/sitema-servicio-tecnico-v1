import { body } from "express-validator";

export const ReglasValidacionUsuario = [
  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El campo 'nombre' es obligatorio.")
    .isLength({ max: 100 })
    .withMessage("El campo 'nombre' no puede superar los 100 caracteres."),

  body("apellidos")
    .trim()
    .notEmpty()
    .withMessage("El campo 'apellidos' es obligatorio.")
    .isLength({ max: 100 })
    .withMessage("El campo 'apellidos' no puede superar los 100 caracteres."),

  body("dni")
    .notEmpty()
    .withMessage("El campo 'dni' es obligatorio.")
    .isInt({ gt: 0 })
    .withMessage("El DNI debe ser un número válido."),

  body("telefono")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("El teléfono debe ser un número válido."),

  body("usuario")
    .trim()
    .notEmpty()
    .withMessage("El campo 'usuario' es obligatorio.")
    .isLength({ min: 3, max: 100 })
    .withMessage("El usuario debe tener entre 3 y 100 caracteres."),

  body("password")
    .if((value, { req }) => req.method === 'POST' || value)
    .notEmpty()
    .withMessage("La contraseña es obligatoria.")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres."),

  body("rol_id")
    .notEmpty()
    .withMessage("El rol es obligatorio.")
    .isInt({ gt: 0 })
    .withMessage("El rol debe ser un número válido."),

  body("usuarioId")
    .notEmpty()
    .withMessage("El usuario que realiza la acción es obligatorio.")
    .isInt({ gt: 0 })
    .withMessage("El usuarioId debe ser un número válido."),

  body("id")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("El id del usuario debe ser un número válido cuando se edita.")
];