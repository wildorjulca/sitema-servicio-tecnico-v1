

//Categoria
export interface Category {
    id?: number,
    usuarioId: number,
    descripcion: string,
    esServicio?: number | null
}
// Equipos
export interface Equipo {
    id?: number;
    nombreequipo: string
    usuarioId: number;
}
// Marcas
export interface Brands {
    id?: number        // opcional, necesario para actualizar o eliminar
    nombre: string     // obligatorio
    usuarioId: number  // obligatorio, el usuario que hace la acción
}


// Tipo_Documento
export interface Document_Type {
    cod_tipo: string,
    nombre_tipo: string,
    cant_digitos: number
}

// producto
export interface Producto {
    id?: number;
    nombre: string;
    descripcion?: string | null;
    precio_compra: number;
    precio_venta: number;
    stock?: number;
    categoria_id: number;
    usuarioId: number;
}

// CLiente
export interface Customer {
    idCliente?: string
    nombre: string,
    TIPO_DOCUMENTO_cod_tipo: string,
    numero_documento: string,
    direccion: string,
    telefono: string
}

// MOTIVO INGRESO
export interface REASON_FOR_ADMISSION {
    descripcion: string,
    precio_cobrar: number
}

// SRVICIO_EQUIPOS
export interface Service_equipment {
    EQUIPO_idequipo: string;
    marca_idMarca: string;
    modelo: string;
    serie: string,
    codigo_barras: string
}

// TECNICO

export interface Technical {
    idTecnico?: string
    nombre: string;
    dni: string;
    celular?: string;
    usuario: string;
    password: string;
}

export interface MotivoIngreso {
    id?: number;
    descripcion: string;
    precio_cobrar?: number | null;
    usuarioId: number;
}


export interface Cliente {
    idCliente?:number
    usuarioId?: number
    id?: number;              // Identificador único (PK)
    nombre: string;          // Nombre del cliente
    apellidos: string;    
    tipo_doc_id:number;    // Apellido del cliente
    numero_documento: string;             // Documento de identidad (8 dígitos si es DNI)
    telefono: string;        // Teléfono del cliente
    direccion: string;       // Dirección de domicilio
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


export interface ServiceFilterParams {
    tecnico_id: number;
    estado_id?: number | null;
    fecha_desde?: string | null;
    fecha_hasta?: string | null;
}

export interface StatsFilterParams {
    tecnico_id: number;
    fecha_desde?: string | null;
    fecha_hasta?: string | null;
}

export interface ServiceResult {
    idServicio: number;
    codigoSeguimiento: string;
    fechaIngreso: string;
    fechaEntrega: string | null;
    estado_id: number;
    estado: string;
    diagnostico: string;
    solucion: string;
    mano_obra: number;
    precioRepuestos: number;
    precioTotal: number;
    tecnico_id: number;
    tecnico_nombre: string;
    tecnico_usuario: string;
    cliente: string;
    equipo: string;
    marca: string;
    modelo: string;
    repuestos: string; // JSON string
}

export interface TechnicianStats {
    tecnico_id: number;
    tecnico_nombre: string;
    tecnico_usuario: string;
    total_servicios: number;
    pendientes: number;
    en_reparacion: number;
    terminados: number;
    entregados: number;
    ingresos_totales: number;
    total_mano_obra: number;
    total_repuestos: number;
    ticket_promedio: number;
    dias_promedio_reparacion: number;
    porcentaje_entregados: number;
    repuestos_utilizados: number;
    valor_total_repuestos: number;
    clientes_unicos: number;
}

export interface Tecnico {
    id: number;
    nombre: string;
    apellidos: string;
    dni: string;
    telefono: string;
    usuario: string;
}
