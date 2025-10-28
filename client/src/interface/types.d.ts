
export interface Servicio {
    idServicio: number;
    codigoSeguimiento: string;
    fechaIngreso: Date;
    // MANTENER como opcional para compatibilidad
    motivo_ingreso_id?: number;
    motivo_ingreso?: string;
    descripcion_motivo?: string;
    observacion: string;
    diagnostico: string;
    solucion: string;
    precio: number;
    usuario_recibe_id: number;
    usuario_recibe: string;
    usuario_soluciona_id: number;
    usuario_soluciona: string;
    fechaEntrega: Date;
    precioRepuestos: number;
    estado_id: number;
    estado: string;
    precioTotal: number;
    servicio_equipos_id: number;
    equipo: string;
    MARCA_idMarca: number;
    marca: string;
    modelo: string;
    serie: string;
    codigo_barras: string;
    cliente_id: number;
    cliente: string;
    Estado_pago?:number;
    
    // NUEVOS CAMPOS
    motivos: MotivoServicio[];
    repuestos: RepuestoServicio[] | null;
}
export interface ServicioResponse {
    status: number;
    success: boolean;
    data: Servicio[];
    total: number;
    mensaje?: string;
    error?: string;
}

export interface Estado {
    idEstado: number,
    nombre: string,
    descripcion: string

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
