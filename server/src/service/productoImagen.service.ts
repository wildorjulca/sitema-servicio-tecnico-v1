import { coneccion } from "../config/conexion";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";

const cn = coneccion();

// Interfaces para el tipado
interface ProductoImagen extends RowDataPacket {
  id: number;
  producto_id: number;
  url: string;
  public_id: string;
}

interface ImagenInsertResult extends ResultSetHeader {
  insertId: number;
}

// Listar imágenes de un producto
const listImagesClaud = async (productoId: number) => {
  console.log("Parámetros enviados a sp_producto_imagen:", { productoId });
  
  try {
    const [results]: any = await cn
      .promise()
      .query(
        "CALL sp_producto_imagen(?, ?, ?, ?, ?)",
        ["LISTAR", null, productoId, null, null]
      );

    console.log("Resultados de sp_producto_imagen", { data: results[0] });
    
    return {
      status: 200,
      success: true,
      data: results[0], // Solo imágenes, sin paginación
    };
  } catch (error: any) {
    console.log("Error en listar imágenes:", error);
    return {
      status: 500,
      success: false,
      mensaje: "Error en la base de datos",
      error: error.sqlMessage || error.message,
    };
  }
};

// Insertar imagen de producto
const insertImageClaud = async (productoId: number, url: string, publicId: string) => {
  console.log("Insertando imagen:", { productoId, url, publicId });
  
  try {
    const [results]: any = await cn
      .promise()
      .query(
        "CALL sp_producto_imagen(?, ?, ?, ?, ?)",
        ["INSERTAR", null, productoId, url, publicId]
      );

    const insertId = results[0]?.insertId || results.insertId;

    return {
      status: 201,
      success: true,
      mensaje: "Imagen insertada correctamente",
      data: { id: insertId },
    };
  } catch (error: any) {
    console.log("Error al insertar imagen:", error);
    return {
      status: 500,
      success: false,
      mensaje: "Error en la base de datos",
      error: error.sqlMessage || error.message,
    };
  }
};

// Eliminar imagen de producto
const deleteImageClaud = async (id: number) => {
  console.log("Eliminando imagen:", { id });
  
  try {
    const [results]: any = await cn
      .promise()
      .query(
        "CALL sp_producto_imagen(?, ?, ?, ?, ?)",
        ["ELIMINAR", id, null, null, null]
      );

    const affectedRows = results.affectedRows || results[0]?.affectedRows || 0;

    return {
      status: 200,
      success: true,
      mensaje: affectedRows > 0 ? "Imagen eliminada" : "No se encontró la imagen",
      data: { affectedRows },
    };
  } catch (error: any) {
    console.log("Error al eliminar imagen:", error);
    return {
      status: 500,
      success: false,
      mensaje: "Error en la base de datos",
      error: error.sqlMessage || error.message,
    };
  }
};

// Obtener imagen por ID
const getImageById = async (id: number) => {
  try {
    const [rows]: any = await cn
      .promise()
      .query(
        "SELECT * FROM producto_imagenes WHERE id = ?",
        [id]
      );

    if (rows.length === 0) {
      return {
        status: 404,
        success: false,
        mensaje: "Imagen no encontrada"
      };
    }

    return {
      status: 200,
      success: true,
      data: rows[0]
    };
  } catch (error: any) {
    console.log("Error al obtener imagen:", error);
    return {
      status: 500,
      success: false,
      mensaje: "Error en la base de datos",
      error: error.sqlMessage || error.message,
    };
  }
};

// Eliminar todas las imágenes de un producto
const deleteAllImagesByProduct = async (productoId: number) => {
  try {
    const [results]: any = await cn
      .promise()
      .query(
        "DELETE FROM producto_imagenes WHERE producto_id = ?",
        [productoId]
      );

    return {
      status: 200,
      success: true,
      mensaje: "Imágenes eliminadas correctamente",
      data: { affectedRows: results.affectedRows }
    };
  } catch (error: any) {
    console.log("Error al eliminar imágenes:", error);
    return {
      status: 500,
      success: false,
      mensaje: "Error en la base de datos",
      error: error.sqlMessage || error.message,
    };
  }
};

export { 
  listImagesClaud, 
  insertImageClaud, 
  deleteImageClaud, 
  getImageById,
  deleteAllImagesByProduct 
};