
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { addUserAPI, deleteUserAPI, editUserAPI, fetchUsers, Users, Usuario } from '@/apis/usuario';
import { showErrorToast } from '@/utils/errorHandler';

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

// ----------------------
// Hook para agregar usuario
// ----------------------

export const useAddUserHook = (usuarioId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: Usuario) =>
      addUserAPI({ ...user, usuarioId }),
    onSuccess: () => {
      toast.success('Usuario agregado correctamente');
      queryClient.invalidateQueries({ queryKey: ['userAll', usuarioId] });
    },
    onError: () => {
      toast.error('Error al agregar usuario');
    },
  });
};

// ----------------------
// Hook para editar usuario
// ----------------------

export const useEditUserHook = (usuarioId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: Usuario) => {
      console.log("➡️ editando usuario:", {
        id: user.id,
        nombre: user.nombre,
        apellidos: user.apellidos,
        dni: user.dni,
        telefono: user.telefono,
        usuario: user.usuario,
        rol_id: user.rol_id,
        usuarioId
      });

      return editUserAPI({ ...user, usuarioId });
    },
    onSuccess: () => {
      toast.success('Usuario actualizado correctamente');
      queryClient.invalidateQueries({ queryKey: ['userAll', usuarioId] });
      queryClient.invalidateQueries({ queryKey: ['userAlls', usuarioId] }); // Invalidar cache individual
    },
    onError:showErrorToast
  });
};

// ----------------------
// Hook para eliminar usuario
// ----------------------


export const useDeleteUserHook = (usuarioId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteUserAPI(id, usuarioId),
    onSuccess: () => {
      toast.success('Usuario eliminado correctamente');
      queryClient.invalidateQueries({ queryKey: ['userAll', usuarioId] });
    },
    onError: showErrorToast,
  });
};

