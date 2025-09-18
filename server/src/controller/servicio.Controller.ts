import { Request, Response } from "express";
import { createServicioEquipo, updateServicioEquipo } from "../service/servicio_equipos.Service";
import { ServicioEquipo } from "../interface";
import { actualizarServicioReparacion, buscarClienteServ, entregarServicioCliente, listEstadoServ, listServicio, registrarServicioBasico } from "../service/servicio.Service";


const getAllServicioCTRL = async (req: Request, res: Response) => {
  const usuarioId = Number(req.params.usuarioId) || 0;
  const pageIndex = Number(req.query.pageIndex) || 0;
  const pageSize = Number(req.query.pageSize) || 10;

  // Obtener los filtros que espera el SP
  const estadoId = req.query.estadoId ? Number(req.query.estadoId) : null;
  const clienteId = req.query.clienteId ? Number(req.query.clienteId) : null;

  const response = await listServicio(
    usuarioId,
    pageIndex,
    pageSize,
    estadoId,
    clienteId
  );

  res.status(response.status).json(response);
};

const getEstadoCTRL = async (req: Request, res: Response) => {
  const response = await listEstadoServ();
  res.status(response.status).json(response);
};

const buscarClienteServicioCTRL = async (req: Request, res: Response) => {
  try {
    // Obtener el filtro de búsqueda
    const filtro = req.query.filtro ? String(req.query.filtro) : '';

    const response = await buscarClienteServ(filtro);

    // Devolver la respuesta
    res.status(response.status).json(response);

  } catch (error: any) {
    console.error("Error en controlador buscarClienteServicioCTRL:", error);

    res.status(500).json({
      status: 500,
      success: false,
      mensaje: "Error interno del servidor",
      error: error.message
    });
  }
};

const registrarServicioBasicoCTRL = async (req: Request, res: Response) => {
  try {
    const {
      fechaIngreso,
      motivo_ingreso_id,
      descripcion_motivo,
      observacion,
      usuario_recibe_id,
      servicio_equipos_id,
      cliente_id
    } = req.body;

    // Validar campos obligatorios
    if (!fechaIngreso || !motivo_ingreso_id || !descripcion_motivo ||
      !usuario_recibe_id || !servicio_equipos_id || !cliente_id) {
      res.status(400).json({
        status: 400,
        success: false,
        mensaje: "Todos los campos obligatorios son requeridos"
      });
    }

    const response = await registrarServicioBasico(
      fechaIngreso,
      motivo_ingreso_id,
      descripcion_motivo,
      observacion || '',
      usuario_recibe_id,
      servicio_equipos_id,
      cliente_id
    );

    res.status(response.status).json(response);

  } catch (error: any) {
    console.error("Error en controlador registrarServicioBasicoCTRL:", error);

    res.status(500).json({
      status: 500,
      success: false,
      mensaje: "Error interno del servidor",
      error: error.message
    });
  }
};

const actualizarServicioReparacionCTRL = async (req: Request, res: Response) => {
  try {
    const {
      servicio_id,
      diagnostico,
      solucion,
      precio_mano_obra,
      usuario_soluciona_id,
      estado_id,
      repuestos
    } = req.body;

    // Validar campos obligatorios
    if (!servicio_id || !diagnostico || !solucion ||
      !usuario_soluciona_id || !estado_id) {
      res.status(400).json({
        status: 400,
        success: false,
        mensaje: "Campos obligatorios faltantes: servicio_id, diagnostico, solucion, usuario_soluciona_id, estado_id"
      });
    }

    // Validar que el estado sea válido (2 o 3)
    if (estado_id !== 2 && estado_id !== 3) {
      res.status(400).json({
        status: 400,
        success: false,
        mensaje: "Estado inválido. Use 2 para 'En reparación' o 3 para 'Reparado'"
      });
    }

    const response = await actualizarServicioReparacion(
      servicio_id,
      diagnostico,
      solucion,
      precio_mano_obra || 0,
      usuario_soluciona_id,
      estado_id,
      repuestos || []
    );

    res.status(response.status).json(response);

  } catch (error: any) {
    console.error("Error en controlador actualizarServicioReparacionCTRL:", error);

    res.status(500).json({
      status: 500,
      success: false,
      mensaje: "Error interno del servidor",
      error: error.message
    });
  }
};

// También puedes agregar el controlador para la entrega si quieres
const entregarServicioCTRL = async (req: Request, res: Response) => {
  try {
    const { servicio_id, usuario_entrega_id } = req.body;

    if (!servicio_id || !usuario_entrega_id) {
      res.status(400).json({
        status: 400,
        success: false,
        mensaje: "Campos obligatorios faltantes: servicio_id, usuario_entrega_id"
      });
    }

    const response = await entregarServicioCliente(
      servicio_id,
      usuario_entrega_id
    );

    res.status(response.status).json(response);

  } catch (error: any) {
    console.error("Error en controlador entregarServicioCTRL:", error);

    res.status(500).json({
      status: 500,
      success: false,
      mensaje: "Error interno del servidor",
      error: error.message
    });
  }
};






export { getAllServicioCTRL, registrarServicioBasicoCTRL, getEstadoCTRL, buscarClienteServicioCTRL, actualizarServicioReparacionCTRL, entregarServicioCTRL }