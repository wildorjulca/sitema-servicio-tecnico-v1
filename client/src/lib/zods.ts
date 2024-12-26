

import { z } from "zod";

export const clienteSchema = z.object({
    nombre: z.string()
        .min(1, { message: "El nombre es obligatorio." })
        .max(75, { message: "El nombre debe tener máximo 75 caracteres." }),

    TIPO_DOCUMENTO_cod_tipo: z.string()
        .min(1, { message: "Seleccione un tipo de documento." }),

    numero_documento: z.string()
        .min(1, { message: "El número de documento es obligatorio." })
        .max(11, { message: "El número de documento debe tener máximo 11 caracteres." }),

    direccion: z.string()
        .max(75, { message: "La dirección debe tener máximo 75 caracteres." }),

    telefono: z.string()
        .max(45, { message: "El teléfono debe tener máximo 45 caracteres." }),
});


export const servicioSchema = z.object({
    MOTIVO_INGRESO_idMOTIVO_INGRESO: z.string()
        .min(1, { message: "Motivo ingreso es obligatorio." }),

    descripcion_motivo: z.string()
        .max(1, { message: "Máximo 95 caracteres." }),

    observacion: z.string()
        .max(11, { message: "máximo 150 caracteres." }),
});


