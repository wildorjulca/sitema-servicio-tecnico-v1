
// export interface Servicio {
//     idservicio: bigint; // Primary Key
//     fechaingreso: Date;
//     MOTIVO_INGRESO_idMOTIVO_INGRESO: bigint;
//     descripcion_motivo?: string; // Opcional
//     observacion?: string; // Opcional
//     diagnostico?: string; // Opcional
//     solucion?: string; // Opcional
//     precio: number;
//     TECNICO_idTecnicoRecibe?: number; // Opcional
//     TECNICO_idTecnicoSoluciona?: number; // Opcional
//     fechaentrega?: Date; // Opcional
//     presupuestos?: number; // Opcional
//     estado: number;
//     precioTotal?: number; // Opcional
//     SERVICIO_EQUIPOS_idservicio: number; // Opcional
//     CLIENTE_idCliente: number;
// }


export interface Servicio {
    idservicio: bigint; // Primary Key
    fechaingreso: Date;
    MOTIVO_INGRESO_idMOTIVO_INGRESO: bigint;
    descripcion_motivo?: string; // Opcional
    observacion?: string; // Opcional
    diagnostico?: string; // Opcional
    solucion?: string; // Opcional
    precio?: number; // Opcional
    TECNICO_idTecnicoRecibe: number; // Obligatorio (corrigiendo el tipo)
    TECNICO_idTecnicoSoluciona?: number; // Opcional
    fechaentrega?: Date; // Opcional
    presupuestos?: number; // Opcional
    estado?: number; // Opcional
    precioTotal?: number; // Opcional
    SERVICIO_EQUIPOS_idservicio?: number; // Opcional
    CLIENTE_idCliente: number; // Obligatorio
}


export interface ServicioEquipo {
    idServicioEquipos?: number;
    EQUIPO_idEquipo: number;
    MARCA_idMarca: number;
    modelo?: string;
    serie?: string;
    codigo_barras?: string;
    usuarioId: number;
}
