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
export type Productos = {
  id: number;
  nombre: string;
  descripcion: string;
  precio_compra: number;
  precio_venta: number;
  stock: number,
  categoria_id: number,
  estado: number,

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

// interface.ts
export interface Clientes {
  id: number;
  idCliente: number;
  nombre: string;
  apellidos: string;
  tipo_doc_id: number;
  numero_documento: number;
  direccion: string;
  telefono: number;
  usuario_id: number;
}

export interface ClienteFront {
  idCliente: number;
  nombre: string;
  apellidos: string;
  tipo_doc_id: number;
  numero_documento: number;
  direccion: string;
  telefono: number;
  usuarioId: number;
}

export interface ClienteEdit {
  idCliente?: number;
  nombre: string;
  apellidos: string;
  tipo_doc_id: number;
  numero_documento: number;
  direccion: string;
  telefono?: number;
  usuarioId: number;
}

export interface Categoria {
  usuarioId?: number;
  id?: number;
  idCATEGORIA: number,
  descripcion: string,
  esServicio: number
}
export interface CategoriaPag {
  idCATEGORIA: number,
  descripcion: string,
  esServicio: number
}
export interface CatAdd {
  usuarioId?: number;
  descripcion: string;
  esServicio: number;

}


export interface ServicioEquipo {
  usuarioId: number,
  idServicioEquipos: number;
  EQUIPO_idEquipo: number;
  MARCA_idMarca: number;
  nombre_equipo?: string;
  nombre_marca?: string;
  modelo?: string;
  serie?: string;
  codigo_barras?: string;
}

export interface ServicioEquipos {
  usuarioId: number,
  idServicioEquipos: number;
  EQUIPO_idEquipo: number;
  nombre_equipo: string;
  MARCA_idMarca: number;
  nombre_marca: string;
  modelo: string;
  serie: string;
  codigo_barras: string;
}

