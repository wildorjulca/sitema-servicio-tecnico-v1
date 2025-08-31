
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


