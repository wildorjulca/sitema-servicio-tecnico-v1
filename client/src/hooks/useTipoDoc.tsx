import { fetchTipoDoc } from '@/apis';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

// Definir la interfaz para un tipo de documento
interface TipoDoc {
  cod_tipo: string;
  nombre_tipo: string;
  cant_digitos: number;
}

// Definir la interfaz para la respuesta del API
interface TipoDocResponse {
  data: TipoDoc[];
  total: number;
}

export const useTipoDocHook = (
  usuarioId?: number,
  pageIndex = 0,
  pageSize = 10
) => {
  const query = useQuery<TipoDocResponse, Error>({
    queryKey: ["tipoDoc", usuarioId, pageIndex, pageSize], // Corregir typo en queryKey
    queryFn: () => fetchTipoDoc(usuarioId!, pageIndex, pageSize),
    enabled: !!usuarioId,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

  // Manejar errores con toast en useEffect para evitar múltiples disparos
  useEffect(() => {
    if (query.isError) {
      toast.error(`Error al cargar tipos de documento: ${query.error?.message || 'Unknown error'}`);
    }
  }, [query.isError, query.error]);

  return {
    ...query,
    data: query.data?.data || [], // Fallback para datos vacíos
    total: query.data?.total || 0, // Fallback para total
  };
};