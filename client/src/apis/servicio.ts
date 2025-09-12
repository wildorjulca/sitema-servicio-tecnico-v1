import { ServicioEquipo } from "@/interface";
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
// agregar servicio equipos
// ----------------------

export const addServicioEquipoAPI = async ({ usuarioId, EQUIPO_idEquipo, MARCA_idMarca, modelo, serie, codigo_barras }: ServicioEquipo) => {
  try {
    const response = await instance.post("/AddServE", { usuarioId, EQUIPO_idEquipo, MARCA_idMarca, modelo, serie, codigo_barras });
    console.log("motivo ingreso agregada:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al agregar servicio equipos:", error);
    throw error;
  }
}

// ----------------------
// Actualizar servicio equipos
// ----------------------

export const editServicioEquipoAPI = async ({ idServicioEquipos, usuarioId, EQUIPO_idEquipo, MARCA_idMarca, modelo, serie, codigo_barras }: ServicioEquipo) => {
  try {
    console.log("➡️ paiload de equipos servicio:", { idServicioEquipos, usuarioId, EQUIPO_idEquipo, MARCA_idMarca, modelo, serie, codigo_barras });
    const response = await instance.put(`/updateServE`, { idServicioEquipos, usuarioId, EQUIPO_idEquipo, MARCA_idMarca, modelo, serie, codigo_barras });
    console.log("servicio equipo:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al edizar servicio equipos:", error);
    throw error;
  }
}

// ----------------------
// Elimizar servicio equipos
// ----------------------
export const deleteServicioEquipoAPI = async (idServicioEquipos: number, usuarioId: number) => {
  try {
    const response = await instance.delete(`/deleteServE/${idServicioEquipos}`, { data: { usuarioId } });
    console.log("servicio equipo eliminado:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar servicio equipos:", error);
    throw error;
  }
}