import { coneccion } from "../config/conexion";
import { ResultSetHeader } from "mysql2";
import { Brands } from "../interface/interface.type";

const cn = coneccion();

// Listar marcas
const listBrands = async (
  usuarioId: number,
  pageIndex = 0,
  pageSize = 10
) => {
  console.log("Parámetros enviados a sp_marca:", { usuarioId, pageIndex, pageSize });
  try {
    const [results]: any = await cn
      .promise()
      .query(
        "CALL sp_marca(?, ?, ?, ?, ?, ?)",
        ["LISTAR_MARCA", null, null, pageIndex, pageSize, usuarioId]
      );

    console.log("Resultados de sp_marca:", { data: results[0], total: results[1][0].total });
    return {
      status: 200,
      success: true,
      data: results[0],
      total: results[1][0].total,
    };
  } catch (error: any) {
    console.log("Error en listBrands:", error);
    return {
      status: 500,
      success: false,
      mensaje: "Error en la base de datos",
      error: error.sqlMessage || error.message,
    };
  }
};

// Insertar marca
const createBrand = async (brand: Brands) => {
  if (!brand.nombre) {
    return {
      status: 400,
      success: false,
      mensaje: "El nombre de la marca es obligatorio",
    };
  }

  try {
    const [rows]: any = await cn
      .promise()
      .query("CALL sp_marca_crud(?, ?, ?, ?)", [
        "INSERTAR_MARCA",
        null,
        brand.nombre,
        brand.usuarioId,
      ]);

    const idInsertado = rows[0][0]?.id_insertado;

    return {
      status: 201,
      success: true,
      mensaje: "Marca creada correctamente",
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

// Actualizar marca
const updateBrand = async (brand: Brands) => {
  if (!brand.id || !brand.nombre) {
    return {
      status: 400,
      success: false,
      mensaje: "El id y nombre de la marca son obligatorios",
    };
  }

  try {
    const [rows]: any = await cn
      .promise()
      .query("CALL sp_marca_crud(?, ?, ?, ?)", [
        "ACTUALIZAR_MARCA",
        brand.id,
        brand.nombre,
        brand.usuarioId,
      ]);

    const filasAfectadas = rows[0][0]?.filas_afectadas || 0;

    return {
      status: 200,
      success: true,
      mensaje: filasAfectadas > 0 ? "Marca actualizada" : "No se encontró la marca",
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

// Eliminar marca
const deleteBrand = async (id: number, usuarioId: number) => {
  if (!id) {
    return {
      status: 400,
      success: false,
      mensaje: "El id de la marca es obligatorio",
    };
  }

  try {
    const [rows]: any = await cn
      .promise()
      .query("CALL sp_marca_crud(?, ?, ?, ?)", [
        "ELIMINAR_MARCA",
        id,
        null,
        usuarioId,
      ]);

    const filasAfectadas = rows[0][0]?.filas_afectadas || 0;

    return {
      status: 200,
      success: true,
      mensaje: filasAfectadas > 0 ? "Marca eliminada" : "No se encontró la marca",
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




const listAllBrands = async () => {
  console.log("Ejecutando sp_listar_marcas sin parámetros");
  
  try {
    const [results]: any = await cn
      .promise()
      .query("CALL sp_listar_marcas()"); // Sin parámetros

    console.log("Resultados de sp_listar_marcas:", { data: results[0] });
    
    return {
      status: 200,
      success: true,
      data: results[0],
      total: results[0].length,
    };
  } catch (error: any) {
    console.log("Error en listAllBrands:", error);
    return {
      status: 500,
      success: false,
      mensaje: "Error en la base de datos",
      error: error.sqlMessage || error.message,
    };
  }
};

export { listBrands, createBrand, updateBrand, deleteBrand , listAllBrands};