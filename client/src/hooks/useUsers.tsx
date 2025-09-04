
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { fetchUsers, Users } from '@/apis/usuario';

// Definir la interfaz para un tipo de documento

// Definir la interfaz para la respuesta del API
interface UserResponse {
  data: Users[];
  total: number;
}

export const useUserHook = (
  usuarioId?: number,
  pageIndex = 0,
  pageSize = 10
) => {
  const query = useQuery<UserResponse, Error>({
    queryKey: ["userAll", usuarioId, pageIndex, pageSize], // Corregir typo en queryKey
    queryFn: () => fetchUsers(usuarioId!, pageIndex, pageSize),
    enabled: !!usuarioId,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

  // Manejar errores con toast en useEffect para evitar múltiples disparos
  useEffect(() => {
    if (query.isError) {
      toast.error(`Error al cargar los usuarios: ${query.error?.message || 'Unknown error'}`);
    }
  }, [query.isError, query.error]);

  return {
    ...query,
    data: query.data?.data || [], // Fallback para datos vacíos
    total: query.data?.total || 0, // Fallback para total
  };
};