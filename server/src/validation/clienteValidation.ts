import { body } from "express-validator";

const ReglasValidacionCliente = [
    body("nombre")
        .trim()
        .notEmpty()
        .withMessage("El nombre es obligatorio.")
        .isLength({ max: 75 })
        .withMessage("El nombre debe tener máximo 75 caracteres."),

    body("tipo_doc_id")
        .notEmpty()
        .withMessage("Seleccione un tipo de documento."),

    body("numero_documento")
        .trim()
        .notEmpty()
        .withMessage("El número de documento es obligatorio.")
        .isLength({ max: 11 })
        .withMessage("El número de documento debe tener máximo 11 caracteres."),

    body("direccion")
        .trim()
        .isLength({ max: 75 })
        .withMessage("La dirección debe tener máximo 75 caracteres."),

    body("telefono")
        .trim()
        .isLength({ max: 45 })
        .withMessage("El teléfono debe tener máximo 45 caracteres.")
];

export { ReglasValidacionCliente };
