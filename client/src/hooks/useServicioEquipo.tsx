import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { ServicioEquipo } from '@/interface';
import { fetchServ_equipo } from '@/apis/servicio_equipo';

// Definir la interfaz para la respuesta del API
interface Servicio_e {
  data: ServicioEquipo[];
  total: number;
}

export const useServicioEquipoHook = (
  usuarioId?: number,
  pageIndex = 0,
  pageSize = 10,
  filtros?: {
    filtroMarca?: number; // Cambiado de string a number

  }
) => {
  const query = useQuery<Servicio_e, Error>({
    queryKey: ["serEq", usuarioId, pageIndex, pageSize, filtros?.filtroMarca], // Eliminados filtros no usados
    queryFn: () =>
      fetchServ_equipo(
        usuarioId!,
        pageIndex,
        pageSize,
        filtros?.filtroMarca, // Solo enviamos este filtro
      ),
    enabled: !!usuarioId,
    staleTime: 0, // fuerza refetch inmediato
    placeholderData: (prev) => prev, // equivalente a keepPreviousData
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(`Error al cargar servicio-equipo: ${query.error?.message || 'Unknown error'}`);
    }
  }, [query.isError, query.error]);

  return {
    ...query,
    data: query.data?.data || [],
    total: query.data?.total || 0,
  };
};