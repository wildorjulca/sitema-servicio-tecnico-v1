import { instance } from "@/lib/axios";

// Interfaces para TypeScript
export interface ServiceFilterParams {
  tecnico_id: number;
  estado_id?: number | null;
  fecha_desde?: string | null;
  fecha_hasta?: string | null;
}

export interface StatsFilterParams {
  tecnico_id: number;
  fecha_desde?: string | null;
  fecha_hasta?: string | null;
}

export interface ServiceResult {
  idServicio: number;
  codigoSeguimiento: string;
  fechaIngreso: string;
  fechaEntrega: string | null;
  estado_id: number;
  estado: string;
  diagnostico: string;
  solucion: string;
  mano_obra: number;
  precioRepuestos: number;
  precioTotal: number;
  tecnico_id: number;
  tecnico_nombre: string;
  tecnico_usuario: string;
  cliente: string;
  equipo: string;
  marca: string;
  modelo: string;
  repuestos: string;
}

export interface TechnicianStats {
  tecnico_id: number;
  tecnico_nombre: string;
  tecnico_usuario: string;
  total_servicios: number;
  pendientes: number;
  en_reparacion: number;
  terminados: number;
  entregados: number;
  ingresos_totales: number;
  total_mano_obra: number;
  total_repuestos: number;
  ticket_promedio: number;
  dias_promedio_reparacion: number;
  porcentaje_entregados: number;
  repuestos_utilizados: number;
  valor_total_repuestos: number;
  clientes_unicos: number;
}

export interface Tecnico {
    id: number;
    nombre: string;
    apellidos: string;
    dni: string;
    telefono: string;
    usuario: string;
}

// Filtrar servicios por técnico
export const fetchServiciosPorTecnico = async (filters: ServiceFilterParams) => {
  try {
    const response = await instance.post<{
      data: ServiceResult[];
      total: number;
      success: boolean;
      mensaje: string;
    }>('/tecnicoF', filters);

    const { data, total } = response.data;

    console.log("Servicios por técnico obtenidos:", { data, total });
    return { data, total };
  } catch (error) {
    console.error("Error al obtener servicios por técnico:", error);
    throw error;
  }
};

// Obtener estadísticas del técnico
export const fetchEstadisticasTecnico = async (filters: StatsFilterParams) => {
  try {
    const response = await instance.post<{
      data: TechnicianStats[];
      success: boolean;
      mensaje: string;
    }>('/estadisticaT', filters);

    const { data } = response.data;

    console.log("Estadísticas del técnico obtenidas:", data);
    return { data: data[0] }; // Retorna el primer elemento del array
  } catch (error) {
    console.error("Error al obtener estadísticas del técnico:", error);
    throw error;
  }
};

// Función para obtener lista de técnicos (si no la tienes)
export const fetchTecnicos = async () => {
  try {
    const response = await instance.get<{
      data: Tecnico;
      total: number;
      success: boolean;
    }>('/lista'); // Ajusta esta ruta según tu API

    const { data } = response.data;
    const { total } = response.data;
    
    return { data,total };
  } catch (error) {
    console.error("Error al obtener la lista de técnicos:", error);
    throw error;
  }
};