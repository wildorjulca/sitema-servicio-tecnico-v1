import { body } from "express-validator";

export const ReglasValidacionProducto = [
  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El campo 'nombre' es obligatorio.")
    .isLength({ max: 150 })
    .withMessage("El campo 'nombre' no puede superar los 150 caracteres."),

  body("descripcion")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("La descripción no puede superar los 500 caracteres."),

  body("precio_compra")
    .notEmpty()
    .withMessage("El precio de compra es obligatorio.")
    .isFloat({ gt: 0 })
    .withMessage("El precio de compra debe ser mayor a 0."),

  body("precio_venta")
    .notEmpty()
    .withMessage("El precio de venta es obligatorio.")
    .isFloat({ gt: 0 })
    .withMessage("El precio de venta debe ser mayor a 0."),

  body("stock")
    .notEmpty()
    .withMessage("El stock es obligatorio y mayor a 1.")
    .isInt({ min: 0 })
    .withMessage("El stock debe ser un número entero mayor o igual a 0."),

  body("categoria_id")
    .notEmpty()
    .withMessage("La categoría es obligatoria.")
    .isInt({ gt: 0 })
    .withMessage("La categoría debe ser un número válido."),

  body("usuarioId")
    .notEmpty()
    .withMessage("El usuario que realiza la acción es obligatorio.")
    .isInt({ gt: 0 })
    .withMessage("El usuarioId debe ser un número válido."),

  body("id")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("El id del producto debe ser un número válido cuando se edita."),
];
