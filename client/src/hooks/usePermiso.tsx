import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { fetchPermiso } from '@/apis/permiso';
import { Permiso } from '@/interface';



// Definir la interfaz para la respuesta del API
interface TipoDocResponse {
  data: Permiso[];
  total: number;
}

export const usePermisoHook = (
  usuarioId?: number,
  pageIndex = 0,
  pageSize = 10
) => {
  const query = useQuery<TipoDocResponse, Error>({
    queryKey: ["tipoDoc", usuarioId, pageIndex, pageSize], // Corregir typo en queryKey
    queryFn: () => fetchPermiso(usuarioId!, pageIndex, pageSize),
    enabled: !!usuarioId,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

  // Manejar errores con toast en useEffect para evitar múltiples disparos
  useEffect(() => {
    if (query.isError) {
      toast.error(`Error al cargar los Permisos: ${query.error?.message || 'Unknown error'}`);
    }
  }, [query.isError, query.error]);

  return {
    ...query,
    data: query.data?.data || [], // Fallback para datos vacíos
    total: query.data?.total || 0, // Fallback para total
  };
};