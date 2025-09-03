import { coneccion } from "../config/conexion"
import { Producto } from "../interface";


const cn = coneccion()

// listar producto 

const listProduct = async (usuarioId: number, pageIndex = 0, pageSize = 10) => {
    try {
        const [results]: any = await cn
            .promise()
            .query(
                "CALL sp_producto(?, ?, ?, ?, ?, ?)",
                ["LISTAR_PRODUCTO", null, null, pageIndex, pageSize, usuarioId]
            );

        const data = results;
        const total = data.length > 0 ? data[0].total : 0;

        return {
            status: 200,
            success: true,
            data,
            total,
        };
    } catch (error: any) {
        console.log("Error en listar productos:", error);
        return {
            status: 500,
            success: false,
            mensaje: "Error en la base de datos",
            error: error.sqlMessage || error.message,
        };
    }
};


// Insertar producto
const createProduct = async (product: Producto) => {
    if (!product.nombre || !product.precio_compra || !product.precio_venta || !product.categoria_id) {
        return {
            status: 400,
            success: false,
            mensaje: "Nombre, precio_compra, precio_venta y categoría son obligatorios",
        };
    }

    try {
        const [rows]: any = await cn.promise().query("CALL sp_producto_crud(?, ?, ?, ?, ?, ?, ?, ?, ?)", [
            "INSERTAR_PRODUCTO",
            null,
            product.nombre,
            product.descripcion || null,
            product.precio_compra,
            product.precio_venta,
            product.stock || 0,
            product.categoria_id,
            product.usuarioId,
        ]);

        const idInsertado = rows[0][0]?.id_insertado;

        return {
            status: 201,
            success: true,
            mensaje: "Producto creado correctamente",
            data: { id: idInsertado },
        };
    } catch (error: any) {
        return {
            status: 500,
            success: false,
            mensaje: "Error en la base de datos",
            error: error.sqlMessage || error.message,
        };
    }
};

// Actualizar producto
const updateProduct = async (product: Producto) => {
    if (!product.id) {
        return {
            status: 400,
            success: false,
            mensaje: "El id del producto es obligatorio",
        };
    }

    try {
        const [rows]: any = await cn.promise().query("CALL sp_producto_crud(?, ?, ?, ?, ?, ?, ?, ?, ?)", [
            "ACTUALIZAR_PRODUCTO",
            product.id,
            product.nombre,
            product.descripcion || null,
            product.precio_compra,
            product.precio_venta,
            product.stock,
            product.categoria_id,
            product.usuarioId,
        ]);

        const filasAfectadas = rows[0][0]?.filas_afectadas || 0;

        return {
            status: 200,
            success: true,
            mensaje: filasAfectadas > 0 ? "Producto actualizado" : "No se encontró el producto",
            data: { filasAfectadas },
        };
    } catch (error: any) {
        return {
            status: 500,
            success: false,
            mensaje: "Error en la base de datos",
            error: error.sqlMessage || error.message,
        };
    }
};

// Eliminar producto
const deleteProduct = async (id: number, usuarioId: number) => {
    if (!id) {
        return {
            status: 400,
            success: false,
            mensaje: "El id del producto es obligatorio",
        };
    }

    try {
        const [rows]: any = await cn.promise().query("CALL sp_producto_crud(?, ?, ?, ?, ?, ?, ?, ?, ?)", [
            "ELIMINAR_PRODUCTO",
            id,
            null,
            null,
            null,
            null,
            null,
            null,
            usuarioId,
        ]);

        const filasAfectadas = rows[0][0]?.filas_afectadas || 0;

        return {
            status: 200,
            success: true,
            mensaje: filasAfectadas > 0 ? "Producto eliminado" : "No se encontró el producto",
            data: { filasAfectadas },
        };
    } catch (error: any) {
        return {
            status: 500,
            success: false,
            mensaje: "Error en la base de datos",
            error: error.sqlMessage || error.message,
        };
    }
};


export { listProduct , createProduct, updateProduct, deleteProduct}