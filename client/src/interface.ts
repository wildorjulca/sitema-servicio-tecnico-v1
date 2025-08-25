export interface ClienteTypes{
    idCliente?: string
    nombre : string,
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