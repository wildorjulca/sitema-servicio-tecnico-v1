import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from './useUser';
import { toast } from 'sonner';
import { fetchPermisosRol, fetchTodosRoles, guardarPermisosRol } from '@/apis/rol_permisos';

// ✅ HOOK PARA LISTAR PERMISOS DE UN ROL
export const usePermisosRol = (rol_id: number) => {
  const { user } = useUser();
  const usuarioId = user?.id;

  return useQuery({
    queryKey: ['permisos-rol', rol_id],
    queryFn: () => fetchPermisosRol(rol_id, usuarioId!),
    enabled: !!usuarioId && !!rol_id && rol_id > 0,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

// ✅ HOOK PARA GUARDAR PERMISOS
export const useGuardarPermisos = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: ({ rol_id, permisos }: { rol_id: number; permisos: number[] }) => 
      guardarPermisosRol(rol_id, permisos, user?.id!),
    
    onSuccess: (data, variables) => {
      toast.success(data.mensaje || "Permisos guardados correctamente");
      
      // ✅ ACTUALIZAR CACHE
      queryClient.invalidateQueries({ 
        queryKey: ['permisos-rol', variables.rol_id] 
      });
    },
    
    onError: (error: any) => {
      console.error('Error al guardar permisos:', error);
      toast.error(error.response?.data?.mensaje || "Error al guardar permisos");
    },
  });
};

// ✅ HOOK PARA OBTENER TODOS LOS ROLES
export const useTodosRoles = () => {
  const { user } = useUser();
  const usuarioId = user?.id;

  return useQuery({
    queryKey: ['todos-roles'],
    queryFn: () => fetchTodosRoles(usuarioId!),
    enabled: !!usuarioId,
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
};