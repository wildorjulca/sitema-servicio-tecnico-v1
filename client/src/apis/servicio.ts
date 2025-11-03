import { Servicio } from "@/interface/types";
import { instance } from "@/lib/axios";
import axios from "axios";

// ----------------------
// listar servicio 
// ----------------------

export const fetchService = async (
  usuarioId: number,
  pageIndex = 0,
  pageSize = 10,
  estadoId: number | null = null,
  clienteId: number | null = null
) => {
  try {
    const response = await instance.get<{
      data: Servicio[];
      total: number;
    }>(
      `/getService/${usuarioId}?pageIndex=${pageIndex}&pageSize=${pageSize}${estadoId ? `&estadoId=${estadoId}` : ""
      }${clienteId ? `&clienteId=${clienteId}` : ""
      }`
    );

    const { data, total } = response.data;

    console.log("servicios obtenidos:", { data, total });
    return { data, total };
  } catch (error) {
    console.error("Error al obtener los servicios:", error);
    throw error;
  };
};

// ----------------------
// listar estados del servicio
// ----------------------


export const fetchEstadoServ = async (
) => {
  try {
    const response = await instance.get(`/getEstado`);
    const { data } = response.data;
    console.log("estados obtenidos:", { data });
    return { data };
  } catch (error) {
    console.error("Error al obtener los estados:", error);
    throw error;
  };
};

// ----------------------
// listar motivos de ingreso nene
// ----------------------


export const fetchMot_Ingreso = async (
) => {
  try {
    const response = await instance.get(`/getMot_ing`);
    const { data } = response.data;
    console.log("estados obtenidos:", { data });
    return { data };
  } catch (error) {
    console.error("Error al obtener los mot ingresos:", error);
    throw error;
  };
};

// ----------------------
// filtro de clientes para listar
// ----------------------


export const filtreClient = async (filtro: string) => {
  try {
    const response = await instance.get(`/filtroClient`, {
      params: { filtro }   // genera => ?filtro=valor
    });

    const data = response.data;
    console.log("estados obtenidos:", data);

    return data;
  } catch (error) {
    console.error("Error al obtener los clientes:", error);
    throw error;
  }
};

// ----------------------
// filtro de productos para reparara paso 2
// ----------------------


export const filtroProduct = async (nombre: string) => {
  try {
    const response = await instance.get(`/filtroP`, {
      params: { nombre }   // genera => ?filtro=valor
    });

    const data = response.data;
    console.log("estados obtenidos:", data);

    return data;
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    throw error;
  }
};

// ----------------------
// despues de filtrar obtiene los equipos del cliente
// ----------------------


export const obtenerEquiposPorCliente = async (cliente_id: number) => {
  try {
    const response = await instance.get(`/equipos-cliente`, {
      params: { cliente_id }  // => ?cliente_id=5
    });

    const data = response.data;
    console.log("Equipos obtenidos:", data);

    return data;
  } catch (error) {
    console.error("Error al obtener equipos del cliente:", error);
    throw error;
  }
};

// ----------------------
// recepcion del equipo paso 1
// ----------------------


// hooks/useService.ts
export const servicioReparacion1 = async (payload: {
  motivos: {  // CAMBIO: Array de motivos en lugar de campos individuales
    motivo_ingreso_id: number;
    descripcion_adicional: string;  // CAMBIO: nombre del campo
    precio_motivo: number;          // NUEVO: precio individual por motivo
  }[];
  observacion: string;
  usuario_recibe_id: number;
  servicio_equipos_id: number;
  cliente_id: number;
  precio_total?: number;  // CAMBIO: precio_final -> precio_total
}) => {
  try {
    console.log('🌐 === INICIANDO LLAMADA API ===');
    console.log('📤 Enviando a /registro-basico:', JSON.stringify(payload, null, 2));
    console.log('🔧 Motivos enviados:', payload.motivos);
    console.log('💰 Precio total en payload:', payload.precio_total);

    const response = await instance.post(`/registro-basico`, payload);

    console.log('📥 Respuesta recibida:', response.data);
    console.log('✅ Llamada API exitosa');

    return response.data;
  } catch (error) {
    console.error('❌ Error en llamada API:');
    console.error('📌 Error:', error);

    if (axios.isAxiosError(error)) {
      console.error('🔧 Axios error details:');
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      console.error('Headers:', error.response?.headers);
    }

    throw error;
  }
};

// NUEVO Servicio - Iniciar reparación (con tu formato)
export const iniciarReparacionService = async (
  servicio_id: number,
  usuario_soluciona_id: number
) => {
  try {
    const response = await instance.post(`/iniciar-repare`, {
      servicio_id,
      usuario_soluciona_id
    });

    return {
      status: 200,
      success: true,
      data: response.data.data,
      mensaje: "Reparación iniciada exitosamente"
    };
  } catch (error) {
    console.error("Error al iniciar reparación:", error);
  }
};

// ----------------------
// reparacion del equipo paso 2
// ----------------------

export const servicioReparacion2 = async (payload: {
  servicio_id: number;
  diagnostico: string;
  solucion: string;
  precio_mano_obra?: number;
  usuario_soluciona_id: number;
  estado_id: number;
  repuestos?: Array<{ producto_id: number; cantidad: number; precio_unitario: number }>;
}) => {
  try {
    const response = await instance.put(`/actualizar-reparacion`, payload);

    const data = response.data;
    console.log("Respuesta al actualizar reparación:", data);

    return data;
  } catch (error) {
    console.error("Error al actualizar reparación:", error);
    throw error;
  }
};

// serern__---------------------------------

// En tu API service - MODIFICAR el endpoint
export const guardarAvanceTecnico = async (payload: {
  servicio_id: number;
  diagnostico: string;
  solucion: string;
  precio_mano_obra?: number;
  usuario_soluciona_id: number;
}) => {
  try {
    const response = await instance.put(`/guardar-avance`, payload);

    // ✅ EL SP AHORA RETORNA LOS REPUESTOS EN results[0]
    const data = response.data;
    console.log("Respuesta al guardar avance:", data);

    // ✅ EXTRAER LOS REPUESTOS DE LA RESPUESTA
    const repuestos = data.data?.repuestos || [];
    console.log("Repuestos cargados:", repuestos);

    return {
      ...data,
      repuestos: repuestos // ✅ INCLUIR REPUESTOS EN LA RESPUESTA
    };
  } catch (error) {
    console.error("Error al guardar avance:", error);
    throw error;
  }
};

export const agregarRepuestosSecretaria = async (payload: {
  servicio_id: number;
  repuestos: Array<{ producto_id: number; cantidad: number; precio_unitario: number }>;
  usuario_agrega_id: number;
}) => {
  try {
    const response = await instance.post(`/agregar-repuestos`, payload);
    return response.data;
  } catch (error) {
    console.error("Error al agregar repuestos:", error);
    throw error;
  }
};

export const aplicarDescuentoRepuestos = async (payload: {
  servicio_id: number;
  descuento_repuestos: number;
  usuario_aplica_id: number;
}) => {
  try {
    const response = await instance.put(`/aplicar-descuento`, payload);
    return response.data;
  } catch (error) {
    console.error("Error al aplicar descuento:", error);
    throw error;
  }
};


export const eliminarRepuestosSecretaria = async (payload: {
  servicio_id: number;
  repuestos_ids: number[];
  usuario_elimina_id: number;
}) => {
  try {
    const response = await instance.delete(`/delete-repuestos`, { data: payload });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar repuestos:", error);
    throw error;
  }
};

export const finalizarReparacion = async (payload: {
  servicio_id: number;
  usuario_soluciona_id: number;
}) => {
  try {
    const response = await instance.put(`/finalizar-reparacion`, payload);
    return response.data;
  } catch (error) {
    console.error("Error al finalizar reparación:", error);
    throw error;
  }
};

// api/servicioApi.ts - AGREGAR ESTA FUNCIÓN
export const obtenerRepuestosServicio = async (servicioId: number) => {
  try {
    const response = await instance.get(`repuestos/${servicioId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener repuestos:", error);
    throw error;
  }
};

// ----------------------
// entrega del equipo paso 3 
// ----------------------


export const entregarServicio = async (payload: {
  servicio_id: number;
  usuario_entrega_id: number;
}) => {
  try {
    const response = await instance.put(`/entregar-servicio`, payload);

    const data = response.data;
    console.log("Respuesta al entregar servicio:", data);

    return data;
  } catch (error) {
    console.error("Error al entregar servicio:", error);
    throw error;
  }
};


export const pagarServicio = async (payload: {
  servicio_id: number;
  usuario_recibe_pago_id: number;
}) => {
  try {
    const response = await instance.put(`/pay`, payload);

    const data = response.data;
    console.log("Respuesta al pagar servicio:", data);

    return data;
  } catch (error) {
    console.error("Error al pagar servicio:", error);
    throw error;
  }
};

// api/servicioApi.ts
export const cancelarServicio = async (payload: {
  servicio_id: number;
  usuario_id: number;
  motivo: string;
}) => {
  try {
    const response = await instance.put(`/cancelar`, payload);

    const data = response.data;
    console.log("Respuesta al cancelar servicio:", data);

    return data;
  } catch (error) {
    console.error("Error al cancelar servicio:", error);
    throw error;
  }
};