
import { coneccion } from "../config/conexion";
import { ResultSetHeader } from "mysql2";

const cn = coneccion();

interface Equipo {
  id?: number;
  nombreequipo: string; // Cambiado de 'nombre' a 'nombreequipo'
  usuarioId: number;
}

// Listar equipos
const listEquipos = async (
  usuarioId: number,
  pageIndex = 0,
  pageSize = 10
) => {
  console.log("Parámetros enviados a sp_equipo:", { usuarioId, pageIndex, pageSize });
  try {
    const [results]: any = await cn
      .promise()
      .query(
        "CALL sp_equipo(?, ?, ?, ?, ?, ?)",
        ["LISTAR_EQUIPO", null, null, pageIndex, pageSize, usuarioId]
      );

    console.log("Resultados de sp_equipo:", { data: results[0], total: results[1][0].total });
    return {
      status: 200,
      success: true,
      data: results[0],
      total: results[1][0].total,
    };
  } catch (error: any) {
    console.log("Error en listEquipos:", error);
    if (error.sqlState === '45000' && error.sqlMessage.includes('Acceso denegado')) {
      return {
        status: 403,
        success: false,
        mensaje: "No tienes permiso para listar equipos",
        error: error.sqlMessage,
      };
    }
    return {
      status: 500,
      success: false,
      mensaje: "Error en la base de datos",
      error: error.sqlMessage || error.message,
    };
  }
};

// Insertar equipo
const createEquipo = async (equipo: Equipo) => {
  try {
    const [rows]: any = await cn
      .promise()
      .query("CALL sp_equipo_crud(?, ?, ?, ?)", [
        "INSERTAR_EQUIPO",
        null,
        equipo.nombreequipo, // Cambiado de 'nombre' a 'nombreequipo'
        equipo.usuarioId,
      ]);

    const idInsertado = rows[0][0]?.id_insertado;

    return {
      status: 201,
      success: true,
      mensaje: "Equipo creado correctamente",
      data: { id: idInsertado },
    };
  } catch (error: any) {
    if (error.sqlState === '45000' && error.sqlMessage.includes('Acceso denegado')) {
      return {
        status: 403,
        success: false,
        mensaje: "No tienes permiso para crear equipos",
        error: error.sqlMessage,
      };
    }
    return {
      status: 500,
      success: false,
      mensaje: "Error en la base de datos",
      error: error.sqlMessage || error.message,
    };
  }
};

// Actualizar equipo
const updateEquipo = async (equipo: Equipo) => {
  try {
    const [rows]: any = await cn
      .promise()
      .query("CALL sp_equipo_crud(?, ?, ?, ?)", [
        "ACTUALIZAR_EQUIPO",
        equipo.id,
        equipo.nombreequipo, // Cambiado de 'nombre' a 'nombreequipo'
        equipo.usuarioId,
      ]);

    const filasAfectadas = rows[0][0]?.filas_afectadas || 0;

    return {
      status: 200,
      success: true,
      mensaje: filasAfectadas > 0 ? "Equipo actualizado" : "No se encontró el equipo",
      data: { filasAfectadas },
    };
  } catch (error: any) {
    if (error.sqlState === '45000' && error.sqlMessage.includes('Acceso denegado')) {
      return {
        status: 403,
        success: false,
        mensaje: "No tienes permiso para actualizar equipos",
        error: error.sqlMessage,
      };
    }
    return {
      status: 500,
      success: false,
      mensaje: "Error en la base de datos",
      error: error.sqlMessage || error.message,
    };
  }
};

// Eliminar equipo
const deleteEquipo = async (id: number, usuarioId: number) => {
  if (!id) {
    return {
      status: 400,
      success: false,
      mensaje: "El id del equipo es obligatorio",
    };
  }

  try {
    const [rows]: any = await cn
      .promise()
      .query("CALL sp_equipo_crud(?, ?, ?, ?)", [
        "ELIMINAR_EQUIPO",
        id,
        null,
        usuarioId,
      ]);

    const filasAfectadas = rows[0][0]?.filas_afectadas || 0;

    return {
      status: 200,
      success: true,
      mensaje: filasAfectadas > 0 ? "Equipo eliminado" : "No se encontró el equipo",
      data: { filasAfectadas },
    };
  } catch (error: any) {
    if (error.sqlState === '45000' && error.sqlMessage.includes('Acceso denegado')) {
      return {
        status: 403,
        success: false,
        mensaje: "No tienes permiso para eliminar equipos",
        error: error.sqlMessage,
      };
    }
    return {
      status: 500,
      success: false,
      mensaje: "Error en la base de datos",
      error: error.sqlMessage || error.message,
    };
  }
};

export { listEquipos, createEquipo, updateEquipo, deleteEquipo };
