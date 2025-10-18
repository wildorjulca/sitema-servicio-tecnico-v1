import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { MotivoIngreso } from '@/interface';
import { addMotivoIngresoAPI, deleteMotivoIngresoAPI, editMotoviIngresoAPI, fetchMotivoIngreso } from '@/apis/motivo_ingreso';
import { showErrorToast } from '@/utils/errorHandler';



// Definir la interfaz para la respuesta del API
interface TipoDocResponse {
  data: MotivoIngreso[];
  total: number;
}

export const useMotivoIngresoHook = (
  usuarioId?: number,
  pageIndex = 0,
  pageSize = 10
) => {
  const query = useQuery<TipoDocResponse, Error>({
    queryKey: ["ref", usuarioId, pageIndex, pageSize], // Corregir typo en queryKey
    queryFn: () => fetchMotivoIngreso(usuarioId!, pageIndex, pageSize),
    enabled: !!usuarioId,
    staleTime: 5 * 60 * 1000, // 2 minutos
  });

  // Manejar errores con toast en useEffect para evitar múltiples disparos
  useEffect(() => {
    if (query.isError) {
      toast.error(`Error al cargar los roles: ${query.error?.message || 'Unknown error'}`);
    }
  }, [query.isError, query.error]);

  return {
    ...query,
    data: query.data?.data || [], // Fallback para datos vacíos
    total: query.data?.total || 0, // Fallback para total
  };
};



// ----------------------
// Hook para agregar motivo ingreso
// ----------------------

export const useAddMotivoIngreso= (usuarioId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (motivo: { descripcion: string, precio_cobrar: number }) =>
      addMotivoIngresoAPI({ ...motivo, usuarioId }), // 👈 solo recibe nombre
    onSuccess: () => {
      toast.success('motivo ingreso agregada');
      queryClient.invalidateQueries({ queryKey: ['ref', usuarioId] });
    },
    onError:showErrorToast
  });
};

// ----------------------
// Hook para editar motivo ingreso
// ----------------------
export const useEditMotivoIngreso = (usuarioId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (brand: MotivoIngreso) => {
      console.log("➡️ editando motivo ingreso:", {
        id: brand.id,
        nombre: brand.descripcion,
        precio_cobrar: brand.precio_cobrar,
        usuarioId
      });

      return editMotoviIngresoAPI({ ...brand, usuarioId });
    },
    onSuccess: () => {
      toast.success('motivo ingreso actualizada');
      queryClient.invalidateQueries({ queryKey: ['ref', usuarioId] });
    },
    onError:showErrorToast
  });
};


// ----------------------
// Hook para eliminar motivo ingreso
// ----------------------
export const useDeleteMotivoIngreso = (usuarioId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteMotivoIngresoAPI(id, usuarioId),
    onSuccess: () => {
      toast.success('motivo ingreso eliminada');
      queryClient.invalidateQueries({ queryKey: ['ref', usuarioId] });
    },
    onError:showErrorToast
  });
};
