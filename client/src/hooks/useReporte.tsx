import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { fetchAlertasInventario, fetchReportePeriodo } from '@/apis/reporte';


// Hook para reporte por periodo
export const useReportePeriodoHook = (
  tipoPeriodo: string,
  fechaBase: string
) => {
  const query = useQuery<{ data: any }, Error>({
    queryKey: ["reporte-periodo", tipoPeriodo, fechaBase],
    queryFn: () => fetchReportePeriodo(tipoPeriodo, fechaBase),
    enabled: !!tipoPeriodo && !!fechaBase,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(`Error al cargar el reporte: ${query.error?.message || 'Error desconocido'}`);
    }
  }, [query.isError, query.error]);

  return {
    ...query,
    data: query.data?.data || { resumen: {}, detalle: [] },
  };
};

// Hook para alertas de inventario (tiempo real)
export const useAlertasInventarioHook = () => {
  const query = useQuery<{ data: any[]; total: number }, Error>({
    queryKey: ["alertas-inventario"],
    queryFn: fetchAlertasInventario,
    refetchInterval: 60000, // Actualizar cada 1 minuto
    staleTime: 0, // Siempre datos frescos
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(`Error al cargar alertas: ${query.error?.message || 'Error desconocido'}`);
    }
  }, [query.isError, query.error]);

  return {
    ...query,
    data: query.data?.data || [],
    total: query.data?.total || 0,
  };
};