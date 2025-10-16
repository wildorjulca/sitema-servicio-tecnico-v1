// hooks/tecnicoHooks.ts
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { fetchEstadisticasTecnico, fetchServiciosPorTecnico, fetchTecnicos, ServiceFilterParams, ServiceResult, StatsFilterParams, TechnicianStats, Tecnico } from '@/apis/tecnico';


// Hook para listar técnicos
export const useTecnicosHook = () => {
  const query = useQuery({
    queryKey: ["tecnicos-lista"],
    queryFn: fetchTecnicos,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(`Error al cargar técnicos: ${query.error?.message || 'Error desconocido'}`);
    }
  }, [query.isError, query.error]);

  return {
    ...query,
    data: query.data?.data || [],
    total: query.data?.total || 0,
  };
};

// Hook para servicios por técnico
export const useServiciosPorTecnicoHook = (filters: ServiceFilterParams) => {
  const query = useQuery<{ data: ServiceResult[]; total: number }, Error>({
    queryKey: ["servicios-tecnico", filters],
    queryFn: () => fetchServiciosPorTecnico(filters),
    enabled: !!filters.tecnico_id, // Solo se ejecuta si hay un técnico seleccionado
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(`Error al cargar servicios: ${query.error?.message || 'Error desconocido'}`);
    }
  }, [query.isError, query.error]);

  return {
    ...query,
    data: query.data?.data || [],
    total: query.data?.total || 0,
  };
};

// Hook para estadísticas del técnico
export const useEstadisticasTecnicoHook = (filters: StatsFilterParams) => {
  const query = useQuery<{ data: TechnicianStats }, Error>({
    queryKey: ["estadisticas-tecnico", filters],
    queryFn: () => fetchEstadisticasTecnico(filters),
    enabled: !!filters.tecnico_id, // Solo se ejecuta si hay un técnico seleccionado
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(`Error al cargar estadísticas: ${query.error?.message || 'Error desconocido'}`);
    }
  }, [query.isError, query.error]);

  return {
    ...query,
    data: query.data?.data || null,
  };
};