import { body, query } from "express-validator";

// Validación para filtro de cliente
export const validateFiltroCliente = () => [
  query("filtro")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("El filtro debe tener entre 1 y 100 caracteres.")
];

// Validación para obtener equipos por cliente
export const validateEquiposPorCliente = () => [
  query("cliente_id")
    .isInt({ min: 1 })
    .withMessage("El ID del cliente debe ser un número válido.")
];

// Validación para registro básico (Paso 1)
export const validateRegistroBasico = () => [
  body("fechaIngreso")
    .notEmpty()
    .withMessage("La fecha de ingreso es obligatoria.")
    .isISO8601()
    .withMessage("La fecha de ingreso debe tener un formato válido."),
  
  body("motivo_ingreso_id")
    .isInt({ min: 1 })
    .withMessage("El ID del motivo de ingreso debe ser un número válido."),
  
  body("descripcion_motivo")
    .trim()
    .notEmpty()
    .withMessage("La descripción del motivo es obligatoria.")
    .isLength({ max: 95 })
    .withMessage("La descripción del motivo no puede superar los 95 caracteres."),
  
  body("observacion")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage("La observación no puede superar los 150 caracteres."),
  
  body("usuario_recibe_id")
    .isInt({ min: 1 })
    .withMessage("El ID del usuario que recibe debe ser un número válido."),
  
  body("servicio_equipos_id")
    .isInt({ min: 1 })
    .withMessage("El ID del equipo de servicio debe ser un número válido."),
  
  body("cliente_id")
    .isInt({ min: 1 })
    .withMessage("El ID del cliente debe ser un número válido.")
];

// Validación para actualizar reparación (Paso 2)
export const validateActualizarReparacion = () => [
  body("servicio_id")
    .isInt({ min: 1 })
    .withMessage("El ID del servicio debe ser un número válido."),
  
  body("diagnostico")
    .trim()
    .notEmpty()
    .withMessage("El diagnóstico es obligatorio.")
    .isLength({ max: 150 })
    .withMessage("El diagnóstico no puede superar los 150 caracteres."),
  
  body("solucion")
    .trim()
    .notEmpty()
    .withMessage("La solución es obligatoria.")
    .isLength({ max: 150 })
    .withMessage("La solución no puede superar los 150 caracteres."),
  
  body("precio_mano_obra")
    .isFloat({ min: 0 })
    .withMessage("El precio de mano de obra debe ser un número válido."),
  
  body("usuario_soluciona_id")
    .isInt({ min: 1 })
    .withMessage("El ID del usuario que soluciona debe ser un número válido."),
  
  body("estado_id")
    .isInt({ min: 2, max: 3 })
    .withMessage("El estado debe ser 2 (En reparación) o 3 (Reparado)."),
  
  body("repuestos")
    .optional()
    .isArray()
    .withMessage("Los repuestos deben ser un array."),
  
  body("repuestos.*.producto_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El ID del producto debe ser un número válido."),
  
  body("repuestos.*.cantidad")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La cantidad debe ser un número válido."),
  
  body("repuestos.*.precio_unitario")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El precio unitario debe ser un número válido.")
];

export const validateGuardarAvance = () => [
  body("servicio_id").isInt({ min: 1 }).withMessage("ID del servicio inválido"),
  
  body("diagnostico")
    .optional()
    .trim()
    .isLength({ max: 150 }).withMessage("Máximo 150 caracteres"),
  
  body("solucion")
    .optional() 
    .trim()
    .isLength({ max: 150 }).withMessage("Máximo 150 caracteres"),
  
  body("precio_mano_obra")
    .isFloat({ min: 0 }).withMessage("Precio mano obra inválido"),
  
  body("usuario_soluciona_id")
    .isInt({ min: 1 }).withMessage("ID técnico inválido")
];

export const validateAgregarRepuestos = () => [
  body("servicio_id").isInt({ min: 1 }).withMessage("ID servicio inválido"),
  
  body("usuario_agrega_id")
    .isInt({ min: 1 }).withMessage("ID usuario agrega inválido"),
  
  body("repuestos")
    .isArray({ min: 1 }).withMessage("Array de repuestos requerido"),
  
  body("repuestos.*.producto_id")
    .isInt({ min: 1 }).withMessage("ID producto inválido"),
  
  body("repuestos.*.cantidad")
    .isInt({ min: 1 }).withMessage("Cantidad inválida"),
  
  body("repuestos.*.precio_unitario")
    .isFloat({ min: 0 }).withMessage("Precio unitario inválido")
];

export const validateFinalizarReparacion = () => [
  body("servicio_id").isInt({ min: 1 }).withMessage("ID servicio inválido"),
  
  body("usuario_soluciona_id")
    .isInt({ min: 1 }).withMessage("ID técnico inválido")
];
// Validación para entregar servicio (Paso 3)
export const validateEntregarServicio = () => [
  body("servicio_id")
    .isInt({ min: 1 })
    .withMessage("El ID del servicio debe ser un número válido."),
  
  body("usuario_entrega_id")
    .isInt({ min: 1 })
    .withMessage("El ID del usuario que entrega debe ser un número válido.")
];