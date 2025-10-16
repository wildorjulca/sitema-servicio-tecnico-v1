import { Request, Response } from "express";

import { agregarRepuestosSecretaria, buscarClienteServ, buscarProduct, eliminarRepuestosSecretaria, entregarServicioCliente, finalizarReparacion, guardarAvanceTecnico, iniciarReparacion, listEstadoServ, listMot_Ingreso, listServicio, obtenerEquiposPorCliente, obtenerRepuestosServicioService, registrarServicioBasico } from "../service/servicio.Service";


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

  res.status(response.status).json(response); return
};

const getMot_IngresoCTRL = async (req: Request, res: Response) => {
  const response = await listMot_Ingreso();
  res.status(response.status).json(response);
  return
};

const getEstadoCTRL = async (req: Request, res: Response) => {
  const response = await listEstadoServ();
  res.status(response.status).json(response);
  return
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
    return
  }
};

const buscarProducCTRL = async (req: Request, res: Response) => {
  try {
    // Obtener el filtro de búsqueda
    const nombre = req.query.nombre ? String(req.query.nombre) : '';

    const response = await buscarProduct(nombre);

    // Devolver la respuesta
    res.status(response.status).json(response);

  } catch (error: any) {
    console.error("Error en controlador buscarProductCTL:", error);

    res.status(500).json({
      status: 500,
      success: false,
      mensaje: "Error interno del servidor",
      error: error.message
    });
    return
  }
};
const obtenerEquiposPorClienteCTRL = async (req: Request, res: Response) => {
  try {
    const { cliente_id } = req.query;

    if (!cliente_id || isNaN(Number(cliente_id))) {
      res.status(400).json({
        status: 400,
        success: false,
        mensaje: "El parámetro 'cliente_id' es requerido y debe ser un número válido"
      });
      return
    }

    const response = await obtenerEquiposPorCliente(Number(cliente_id));

    if (response.success) {
      res.status(response.status).json({
        success: true,
        data: response.data,
        total: response.total,
        mensaje: "Equipos del cliente obtenidos exitosamente"
      });
      return
    } else {
      res.status(response.status).json({
        success: false,
        mensaje: response.mensaje,
        error: response.error
      });
      return
    }
  } catch (error: any) {
    console.error("Error en controlador obtenerEquiposPorClienteCTRL:", error);

    res.status(500).json({
      status: 500,
      success: false,
      mensaje: "Error interno del servidor",
      error: error.message
    });
    return
  }
};

const registrarServicioBasicoCTRL = async (req: Request, res: Response) => {
  try {
    const {
      motivos,  // CAMBIO: Ahora recibe array de motivos
      observacion,
      usuario_recibe_id,
      servicio_equipos_id,
      cliente_id,
      precio_total  // CAMBIO: precio_final -> precio_total
    } = req.body;

    console.log('📦 Body recibido:', req.body);
    console.log('🔧 Motivos recibidos:', motivos);

    // Validar campos obligatorios
    if (!motivos || !Array.isArray(motivos) || motivos.length === 0 || 
        !usuario_recibe_id || !servicio_equipos_id || !cliente_id) {
      res.status(400).json({
        status: 400,
        success: false,
        mensaje: "Todos los campos obligatorios son requeridos, incluyendo al menos un motivo"
      });
      return;
    }

    const response = await registrarServicioBasico(
      motivos,           // Array de motivos
      observacion || '',
      usuario_recibe_id,
      servicio_equipos_id,
      cliente_id,
      precio_total       // Precio total del servicio
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
    return;
  }
};
const iniciarReparacionCTRL = async (req: Request, res: Response) => {
  try {
    const { servicio_id, usuario_soluciona_id } = req.body;

    // Validar campos obligatorios
    if (!servicio_id || !usuario_soluciona_id) {
      res.status(400).json({
        status: 400,
        success: false,
        mensaje: "Faltan campos obligatorios: servicio_id, usuario_soluciona_id"
      });
      return;
    }

    const response = await iniciarReparacion(servicio_id, usuario_soluciona_id);

    res.status(response.status).json(response);

  } catch (error: any) {
    console.error("Error en iniciarReparacionCTRL:", error);
    res.status(500).json({
      status: 500,
      success: false,
      mensaje: "Error interno del servidor",
      error: error.message
    });
  }
};

// no sirve 
// const actualizarServicioReparacionCTRL = async (req: Request, res: Response) => {
//   try {
//     const {
//       servicio_id,
//       diagnostico,
//       solucion,
//       precio_mano_obra,
//       usuario_soluciona_id,
//       estado_id,
//       repuestos
//     } = req.body;

//     // Validar campos obligatorios
//     if (!servicio_id || !diagnostico || !solucion ||
//       !usuario_soluciona_id || !estado_id) {
//       res.status(400).json({
//         status: 400,
//         success: false,
//         mensaje: "Campos obligatorios faltantes: servicio_id, diagnostico, solucion, usuario_soluciona_id, estado_id"
//       });
//       return
//     }

//     // Validar que el estado sea válido (2 o 3)
//     if (estado_id !== 2 && estado_id !== 3) {
//       res.status(400).json({
//         status: 400,
//         success: false,
//         mensaje: "Estado inválido. Use 2 para 'En reparación' o 3 para 'Reparado'"
//       });
//       return
//     }

//     const response = await actualizarServicioReparacion(
//       servicio_id,
//       diagnostico,
//       solucion,
//       precio_mano_obra || 0,
//       usuario_soluciona_id,
//       estado_id,
//       repuestos || []
//     );

//     res.status(response.status).json(response);

//   } catch (error: any) {
//     console.error("Error en controlador actualizarServicioReparacionCTRL:", error);

//     res.status(500).json({
//       status: 500,
//       success: false,
//       mensaje: "Error interno del servidor",
//       error: error.message
//     });
//     return
//   }
// };

const guardarAvanceTecnicoCTRL = async (req: Request, res: Response) => {
  const { servicio_id, diagnostico, solucion, precio_mano_obra, usuario_soluciona_id } = req.body;

  try {
    // Validaciones básicas
    if (!servicio_id || !usuario_soluciona_id) {
      res.status(400).json({
        success: false,
        mensaje: "Faltan campos obligatorios: servicio_id y usuario_soluciona_id"
      });
      return;
    }

    const response = await guardarAvanceTecnico(
      servicio_id,
      diagnostico || "",
      solucion || "",
      precio_mano_obra || 0,
      usuario_soluciona_id
    );

    res.status(response.status).json(response);

  } catch (error: any) {
    console.error("Error en controller guardar avance:", error);
    res.status(500).json({
      success: false,
      mensaje: "Error interno del servidor",
      error: error.message
    });
  }
};

const agregarRepuestosSecretariaCTRL = async (req: Request, res: Response) => {
  const { servicio_id, repuestos, usuario_agrega_id } = req.body;

  try {
    // Validaciones básicas
    if (!servicio_id || !usuario_agrega_id) {
      res.status(400).json({
        success: false,
        mensaje: "Faltan campos obligatorios: servicio_id y usuario_agrega_id"
      });
      return;
    }

    if (!repuestos || !Array.isArray(repuestos) || repuestos.length === 0) {
      res.status(400).json({
        success: false,
        mensaje: "El array de repuestos no puede estar vacío"
      });
      return;
    }

    const response = await agregarRepuestosSecretaria(
      servicio_id,
      repuestos,
      usuario_agrega_id
    );

    res.status(response.status).json(response);

  } catch (error: any) {
    console.error("Error en controller agregar repuestos:", error);
    res.status(500).json({
      success: false,
      mensaje: "Error interno del servidor",
      error: error.message
    });
  }
};

const eliminarRepuestosSecretariaCTRL = async (req: Request, res: Response) => {
  const { servicio_id, repuestos_ids, usuario_elimina_id } = req.body;

  try {
    // Validaciones básicas
    if (!servicio_id || !usuario_elimina_id) {
      res.status(400).json({
        success: false,
        mensaje: "Faltan campos obligatorios: servicio_id y usuario_elimina_id"
      });
      return;
    }

    if (!repuestos_ids || !Array.isArray(repuestos_ids) || repuestos_ids.length === 0) {
      res.status(400).json({
        success: false,
        mensaje: "El array de repuestos_ids no puede estar vacío"
      });
      return;
    }

    // Validar que todos los IDs sean números válidos
    const idsInvalidos = repuestos_ids.filter(id => !Number.isInteger(id) || id <= 0);
    if (idsInvalidos.length > 0) {
      res.status(400).json({
        success: false,
        mensaje: "Algunos IDs de repuestos no son válidos",
        ids_invalidos: idsInvalidos
      });
      return;
    }

    const response = await eliminarRepuestosSecretaria(
      servicio_id,
      repuestos_ids,
      usuario_elimina_id
    );

    res.status(response.status).json(response);

  } catch (error: any) {
    console.error("Error en controller eliminar repuestos:", error);
    res.status(500).json({
      success: false,
      mensaje: "Error interno del servidor",
      error: error.message
    });
  }
};

const finalizarReparacionCTRL = async (req: Request, res: Response) => {
  const { servicio_id, usuario_soluciona_id } = req.body;

  try {
    // Validaciones básicas
    if (!servicio_id || !usuario_soluciona_id) {
      res.status(400).json({
        success: false,
        mensaje: "Faltan campos obligatorios: servicio_id y usuario_soluciona_id"
      });
      return;
    }

    const response = await finalizarReparacion(
      servicio_id,
      usuario_soluciona_id
    );

    res.status(response.status).json(response);

  } catch (error: any) {
    console.error("Error en controller finalizar reparación:", error);
    res.status(500).json({
      success: false,
      mensaje: "Error interno del servidor",
      error: error.message
    });
  }
};

// controllers/servicioController.ts - AGREGAR ESTA FUNCIÓN
const obtenerRepuestosServicioCTRL = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Validar que el ID sea un número válido
    const servicioId = parseInt(id);
    if (isNaN(servicioId) || servicioId <= 0) {
      res.status(400).json({
        success: false,
        mensaje: "ID de servicio no válido"
      });
      return;
    }

    const response = await obtenerRepuestosServicioService(servicioId);

    console.log('📦 Repuestos encontrados para servicio', servicioId, ':', response.data);

    res.status(response.success ? 200 : 500).json(response);
  } catch (error: any) {
    console.error('Error en controller obtener repuestos:', error);
    res.status(500).json({
      success: false,
      mensaje: "Error interno del servidor",
      error: error.message
    });
  }
};

const entregarServicioCTRL = async (req: Request, res: Response) => {
  try {
    const { servicio_id, usuario_entrega_id } = req.body;

    if (!servicio_id || !usuario_entrega_id) {
      res.status(400).json({
        status: 400,
        success: false,
        mensaje: "Campos obligatorios faltantes: servicio_id, usuario_entrega_id"
      });
      return
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
    return
  }
};






export { guardarAvanceTecnicoCTRL, agregarRepuestosSecretariaCTRL,eliminarRepuestosSecretariaCTRL, finalizarReparacionCTRL, obtenerRepuestosServicioCTRL, getAllServicioCTRL, getMot_IngresoCTRL, buscarProducCTRL, registrarServicioBasicoCTRL, getEstadoCTRL, buscarClienteServicioCTRL, obtenerEquiposPorClienteCTRL, iniciarReparacionCTRL, entregarServicioCTRL }