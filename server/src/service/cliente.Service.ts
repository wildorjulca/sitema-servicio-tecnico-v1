import { coneccion } from "../config/conexion"
import { Cliente } from "../interface";

const cn = coneccion()

const listClient = async (
    usuarioId: number,
    pageIndex = 0,
    pageSize = 10
) => {
    console.log("Parámetros enviados a sp_roles:", { usuarioId, pageIndex, pageSize });
    try {
        const [results]: any = await cn
            .promise()
            .query(
                "CALL sp_cliente(?, ?, ?, ?, ?, ?)",
                ["LISTAR_CLIENTE", null, null, pageIndex, pageSize, usuarioId]
            );

        console.log("Resultados de sp_cliente", { data: results[0], total: results[1][0].total });
        return {
            status: 200,
            success: true,
            data: results[0],
            total: results[1][0].total,
        };
    } catch (error: any) {
        console.log("Error en listar clientes:", error);
        return {
            status: 500,
            success: false,
            mensaje: "Error en la base de datos",
            error: error.sqlMessage || error.message,
        };
    }
};



// Insertar cliente
const createCliente = async (cliente: Cliente) => {
  try {
    const [rows]: any = await cn.promise().query("CALL sp_cliente_crud(?, ?, ?, ?, ?, ?, ?, ?, ?)", [
      "INSERTAR_CLIENTE",
      null, // idCliente null porque se genera automáticamente
      cliente.nombre,
      cliente.apellidos,
      cliente.cod_tipo,
      cliente.numero_documento,
      cliente.direccion,
      cliente.telefono,
      cliente.usuarioId,
    ]);

    const idInsertado = rows[0][0]?.id_insertado;

    return {
      status: 201,
      success: true,
      mensaje: "Cliente creado correctamente",
      data: { id: idInsertado },
    };
  } catch (error: any) {
    if (error.sqlState === "45000" && error.sqlMessage.includes("Acceso denegado")) {
      return {
        status: 403,
        success: false,
        mensaje: "No tienes permiso para crear clientes",
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

// Actualizar cliente
const updateCliente = async (cliente: Cliente) => {
  try {
    const [rows]: any = await cn.promise().query("CALL sp_cliente_crud(?, ?, ?, ?, ?, ?, ?, ?, ?)", [
      "ACTUALIZAR_CLIENTE",
      cliente.idCliente,
      cliente.nombre,
      cliente.apellidos,
      cliente.cod_tipo,
      cliente.numero_documento,
      cliente.direccion,
      cliente.telefono,
      cliente.usuarioId,
    ]);

    const filasAfectadas = rows[0][0]?.filas_afectadas || 0;

    return {
      status: 200,
      success: true,
      mensaje: filasAfectadas > 0 ? "Cliente actualizado" : "No se encontró el cliente",
      data: { filasAfectadas },
    };
  } catch (error: any) {
    if (error.sqlState === "45000" && error.sqlMessage.includes("Acceso denegado")) {
      return {
        status: 403,
        success: false,
        mensaje: "No tienes permiso para actualizar clientes",
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

// Eliminar cliente
const deleteCliente = async (idCliente: number, usuarioId: number) => {
  if (!idCliente) {
    return {
      status: 400,
      success: false,
      mensaje: "El id del cliente es obligatorio",
    };
  }

  try {
    const [rows]: any = await cn.promise().query("CALL sp_cliente_crud(?, ?, ?, ?, ?, ?, ?, ?, ?)", [
      "ELIMINAR_CLIENTE",
      idCliente,
      null, // nombre
      null, // apellidos
      null, // cod_tipo
      null, // numero_documento
      null, // direccion
      null, // telefono
      usuarioId,
    ]);

    const filasAfectadas = rows[0][0]?.filas_afectadas || 0;

    return {
      status: 200,
      success: true,
      mensaje: filasAfectadas > 0 ? "Cliente eliminado" : "No se encontró el cliente",
      data: { filasAfectadas },
    };
  } catch (error: any) {
    if (error.sqlState === "45000" && error.sqlMessage.includes("Acceso denegado")) {
      return {
        status: 403,
        success: false,
        mensaje: "No tienes permiso para eliminar clientes",
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

export { listClient, createCliente, updateCliente, deleteCliente }