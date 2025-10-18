import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { Categoria } from '@/interface';
import { addCatAPI, deleteCatAPI, editCatAPI, fetchCat } from '@/apis/categoria';
import { showErrorToast } from '@/utils/errorHandler';



// Definir la interfaz para la respuesta del API
interface TipoDocResponse {
  data: Categoria[];
  total: number;
}

export const useCatHook = (
  usuarioId?: number,
  pageIndex = 0,
  pageSize = 10
) => {
  const query = useQuery<TipoDocResponse, Error>({
    queryKey: ["catref", usuarioId, pageIndex, pageSize], // Corregir typo en queryKey
    queryFn: () => fetchCat(usuarioId!, pageIndex, pageSize),
    enabled: !!usuarioId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Manejar errores con toast en useEffect para evitar múltiples disparos
  useEffect(() => {
    if (query.isError) {
      toast.error(`Error al cargar las categorias: ${query.error?.message || 'Unknown error'}`);
    }
  }, [query.isError, query.error]);

  return {
    ...query,
    data: query.data?.data || [], // Fallback para datos vacíos
    total: query.data?.total || 0, // Fallback para total
  };
};

// ----------------------
// Hook para agregar categoria
// ----------------------

export const useAddCatHook = (usuarioId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cat: { descripcion: string, esServicio: number }) =>
      addCatAPI({ ...cat, usuarioId }), // 👈 solo recibe nombre
    onSuccess: () => {
      toast.success('categoria agregada');
      queryClient.invalidateQueries({ queryKey: ['catref', usuarioId] });
    },
    onError:showErrorToast
  });
};

// ----------------------
// Hook para editar categoria
// ----------------------
export const useEditCatHook = (usuarioId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cat: Categoria) => {
      console.log("➡️ editando categoria:", {
        id: cat.id,
        nombre: cat.descripcion,
        esServicio: cat.esServicio,
        usuarioId
      });

      return editCatAPI({ ...cat, usuarioId });
    },
    onSuccess: () => {
      toast.success('categoria actualizada');
      queryClient.invalidateQueries({ queryKey: ['catref', usuarioId] });
    },
    onError: showErrorToast
  });
};


// ----------------------
// Hook para eliminar categoria
// ----------------------
export const useDeleteCatHook = (usuarioId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCatAPI(id, usuarioId),
    onSuccess: () => {
      toast.success('categoria eliminada');
      queryClient.invalidateQueries({ queryKey: ['catref', usuarioId] });
    },
    onError:showErrorToast
  });
};
