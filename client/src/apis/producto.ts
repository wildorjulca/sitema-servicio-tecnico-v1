import { instance } from "@/lib/axios"


// Interfaces
export interface Producto {
  id: number
  nombre: string
  descripcion?: string
  precio_compra: number
  precio_venta: number
  stock: number
  categoria_id: number
  usuarioId: number
}

export interface ProductoInit {
  nombre: string
  descripcion?: string
  precio_compra: number
  precio_venta: number
  stock: number
  categoria_id: number
  usuarioId: number
}


// ----------------------
// Listar productos
// ----------------------
// ----------------------
export const fetchProductos = async (usuarioId: number, pageIndex = 0, pageSize = 10) => {
  try {
    const response = await instance.get(`/getAllProduc/${usuarioId}?pageIndex=${pageIndex}&pageSize=${pageSize}`);
    const { data, total } = response.data;
    return { data, total };
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw error;
  }
};

// ----------------------
// Agregar producto
// ----------------------
export const addProducto = async (producto: ProductoInit) => {
  try {
    const response = await instance.post("/productos", producto);
    return response.data;
  } catch (error) {
    console.error("Error al agregar producto:", error);
    throw error;
  }
};

// ----------------------
// Actualizar producto
// ----------------------
export const editProducto = async (producto: Producto) => {
  try {
    const response = await instance.put(`/productos/${producto.id}`, producto);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    throw error;
  }
};

// ----------------------
// Eliminar producto
// ----------------------
export const deleteProducto = async (id: number, usuarioId: number) => {
  try {
    const response = await instance.delete(`/productos/${id}`, { data: { usuarioId } });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    throw error;
  }
};