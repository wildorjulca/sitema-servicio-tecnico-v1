export interface ClienteTypes {
  idCliente?: string
  nombre: string,
  TIPO_DOCUMENTO_cod_tipo: string,
  numero_documento: string,
  direccion: string,
  telefono: string

}
// types.ts
export interface BrandType {
  id: number;
  idMarca: number;  // 👈 obligatorio
  nombre: string;
  usuarioId: number;
}
export type Producto = {
  id: string;
  nombre: string;
  precio: number;
  stock: number;
  categoria?: string; // Optional field, adjust as needed
};

export interface Permiso {
  id: string;
  nombre: string;
  descripcion: number;
}

export interface PermisoPag {
  id: string;
  nombre: string;
  descripcion: number;
}

export interface Rol {
  id: number;
  tipo_rol: string;

}

export interface RolPag {
  id: number;
  tipo_rol: string;


}

export interface MotivoIngreso {
  usuarioId?: number;
  id?: number;
  idMotivo: number;
  descripcion: string;
  precio_cobrar: number;

}

export interface addMotivoIngreso {
  usuarioId?: number;
  descripcion: string;
  precio_cobrar: number;

}

export interface MotivoIngresoPag {
  idMotivo: number;
  descripcion: string;
  precio_cobrar: number;

}

export interface Cliente {
  idCliente: number,
  nombre: string,
  apellidos: string,
  TIPO_DOCUMENTO_cod_tipo: number,
  numero_documento: number,
  direccion: string,
  telefono: number

}

export interface ClientePag {
  idCliente: number,
  nombre: string,
  apellidos: string,
  TIPO_DOCUMENTO_cod_tipo: number,
  numero_documento: number,
  direccion: string,
  telefono: number

}