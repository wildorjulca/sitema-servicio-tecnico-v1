import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addEquiposApi, deleteEquiposApi, editEquiposApi, Equipo, fetchEquipoCbo, fetchEquiposApi } from '@/apis';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios'; // Importar AxiosError

// Hook para listar equipos
interface EquipoResponse {
  data: { idequipo: number; nombreequipo: string; usuarioId?: number }[];
  total: number;
}

export const useEquipoHook = (
  usuarioId?: number,
  pageIndex = 0,
  pageSize = 10
) => {
  const query = useQuery<EquipoResponse, Error>({
    queryKey: ["allEquipo", usuarioId, pageIndex, pageSize],
    queryFn: () => fetchEquiposApi(usuarioId!, pageIndex, pageSize),
    enabled: !!usuarioId,
    retry: false,
    staleTime: 2 * 60 * 1000,
  });

  if (query.isError) {
    toast.error("Error al cargar equipos");
  }

  return {
    ...query,
    data: query.data?.data || [],
    total: query.data?.total || 0,
  };
};

// Hook para agregar equipo
export const useAddEquipoHook = (usuarioId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (equipo: { nombreequipo: string }) =>
      addEquiposApi({ ...equipo, usuarioId }),
    onSuccess: () => {
      toast.success('Equipo agregado');
      queryClient.invalidateQueries({ queryKey: ['allEquipo', usuarioId] });
    },
    onError: (error: AxiosError<{ mensaje?: string }>) => {
      toast.error(error.response?.data?.mensaje || 'Error al agregar equipo');
    },
  });
};

// Hook para editar equipo
export const useEditEquipoHook = (usuarioId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (equipo: Equipo) => {
      console.log("➡️ editando equipo:", {
        id: equipo.id,
        nombreequipo: equipo.nombreequipo,
        usuarioId,
      });
      return editEquiposApi({ ...equipo, usuarioId });
    },
    onSuccess: () => {
      toast.success('Equipo actualizado');
      queryClient.invalidateQueries({ queryKey: ['allEquipo', usuarioId] });
    },
    onError: (error: AxiosError<{ mensaje?: string }>) => {
      toast.error(error.response?.data?.mensaje || 'Error al actualizar equipo');
    },
  });
};

// Hook para eliminar equipo
export const useDeleteEquipoHook = (usuarioId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteEquiposApi(id, usuarioId),
    onSuccess: () => {
      toast.success('Equipo eliminado');
      queryClient.invalidateQueries({ queryKey: ['allEquipo', usuarioId] });
    },
    onError: (error: AxiosError<{ mensaje?: string }>) => {
      toast.error(error.response?.data?.mensaje || 'Error al eliminar equipo');
    },
  });
};


export const useEquiposCboHook = () => {
  const query = useQuery({
    queryKey: ["equipo"], // Key única para el cache
    queryFn: fetchEquipoCbo,   // Función que llama a la API
  });

  if (query.isError) {
    toast.error("Error al cargar equipos sin pag");
  }

  return {
    ...query,
    data: query.data?.data || [], // Extrae el array de datos
  };
};