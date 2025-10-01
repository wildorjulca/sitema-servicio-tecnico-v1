
import { z } from "zod";

export const clienteSchema = z.object({
    nombre: z.string()
        .min(1, { message: "El nombre es obligatorio." })
        .max(75, { message: "El nombre debe tener máximo 75 caracteres." }),

    apellidos: z.string()
        .min(1, { message: "El apellido es obligatorio." })
        .max(75, { message: "El apellido debe tener máximo 75 caracteres." }),

    tipo_doc_id: z.string()
        .min(1, { message: "Seleccione un tipo de documento." }),

    numero_documento: z.string()
        .regex(/^\d+$/, { message: "El número de documento debe contener solo números." })
        .min(8, { message: "El número de documento debe tener mínimo 8 caracteres." })
        .max(11, { message: "El número de documento debe tener máximo 11 caracteres." }),

    direccion: z.string()
        .max(75, { message: "La dirección debe tener máximo 75 caracteres." })
        .optional(),

    telefono: z.string()
        .regex(/^\d+$/, { message: "El teléfono debe contener solo números." })
        .max(15, { message: "El teléfono debe tener máximo 15 caracteres." })
        .optional(),
});

export const servicioSchema = z.object({
    MOTIVO_INGRESO_idMOTIVO_INGRESO: z.string()
        .min(1, { message: "Motivo ingreso es obligatorio." }),

    descripcion_motivo: z.string()
        .max(1, { message: "Máximo 95 caracteres." }),

    observacion: z.string()
        .max(11, { message: "máximo 150 caracteres." }),
});

// usuarios validacion formulario 

// En tu archivo zods.ts
export const usuarioSchema = z.object({
  nombre: z.string()
    .min(1, "El campo 'nombre' es obligatorio.")
    .max(100, "El campo 'nombre' no puede superar los 100 caracteres.")
    .trim(),
    
  apellidos: z.string()
    .min(1, "El campo 'apellidos' es obligatorio.")
    .max(100, "El campo 'apellidos' no puede superar los 100 caracteres.")
    .trim(),
    
  dni: z.string()
    .min(1, "El campo 'dni' es obligatorio.")
    .min(8, "El DNI debe tener exactamente 8 caracteres.")
    .max(8, "El DNI debe tener exactamente 8 caracteres.")
    .regex(/^\d+$/, "El DNI debe contener solo números"),
    
  telefono: z.number()
    .int("El teléfono debe ser un número entero.")
    .positive("El teléfono debe ser un número válido.")
    .optional()
    .or(z.literal('').transform(() => undefined)),
    
  usuario: z.string()
    .min(1, "El campo 'usuario' es obligatorio.")
    .min(3, "El usuario debe tener al menos 3 caracteres.")
    .max(100, "El usuario no puede superar los 100 caracteres.")
    .trim(),
    
  password: z.string()
    .min(1, "La contraseña es obligatoria.")
    .min(6, "La contraseña debe tener al menos 6 caracteres.")
    .optional(),
    
  rol_id: z.number()
    .int("El rol debe ser un número entero.")
    .positive("El rol debe ser un número válido."),
    
  usuarioId: z.number()
    .int("El usuarioId debe ser un número entero.")
    .positive("El usuarioId debe ser un número válido."),
    
  id: z.number()
    .int("El id debe ser un número entero.")
    .positive("El id debe ser un número válido.")
    .optional()
});

// Schema específico para creación (password obligatorio)
export const usuarioCreateSchema = usuarioSchema.extend({
    password: z.string()
        .min(1, "La contraseña es obligatoria.")
        .min(6, "La contraseña debe tener al menos 6 caracteres.")
});

// Schema específico para actualización (password opcional, id obligatorio)
export const usuarioUpdateSchema = usuarioSchema.extend({
    id: z.number()
        .int("El id debe ser un número entero.")
        .positive("El id debe ser un número válido."),
    password: z.string()
        .min(6, "La contraseña debe tener al menos 6 caracteres.")
        .optional()
        .or(z.literal('').transform(() => undefined))
});

// Tipo TypeScript inferido del schema
export type UsuarioFormData = z.infer<typeof usuarioSchema>;