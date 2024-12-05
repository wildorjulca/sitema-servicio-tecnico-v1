

//Categoria
export interface Category {
    descripcion: string,
    esServicio?: number
}
// Equipos
export interface Equipment {
    nombreequipo: string
}
// Marcas
export interface Brands {
    nombre: String
}

// Tipo_Documento
export interface Document_Type {
    cod_tipo: string,
    nombre_tipo: string,
    cant_digitos: number
}

// CLiente
export interface Customer{
    nombre : string,
    TIPO_DOCUMENTO_cod_tipo: string,
    numero_documento: string,
    direccion: string,
    telefono: string
}

// MOTIVO INGRESO
export interface REASON_FOR_ADMISSION {
    descripcion: string,
    precio_cobrar : number
}