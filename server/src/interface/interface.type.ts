

//Categoria
export interface Category {
    descripcion: string,
    esServicio?: number
}
// Equipos
export interface Equipo {
    id?: number;
    nombreequipo:string
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
