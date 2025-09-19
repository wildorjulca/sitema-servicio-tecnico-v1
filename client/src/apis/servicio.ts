import {  Servicio } from "@/interface/types";
import { instance } from "@/lib/axios";

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
    console.error("Error al obtener los estados:", error);
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


export const servicioReparacion1 = async (payload: {
  servicio_id: number;
  diagnostico: string;
  solucion: string;
  precio_mano_obra?: number;
  usuario_soluciona_id: number;
  estado_id: number;
  repuestos?: any[]; // ajusta al tipo real de tus repuestos
}) => {
  try {
    const response = await instance.put(`/actualizar-reparacion`, payload);

    const data = response.data;
    console.log("Respuesta al actualizar servicio:", data);

    return data;
  } catch (error) {
    console.error("Error al actualizar servicio:", error);
    throw error;
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
