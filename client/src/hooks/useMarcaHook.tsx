import { addBrandAPI, Brand, deleteBrandAPI, editBrandAPI, fetchBrands } from '@/apis';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// ----------------------
// Hook para listar marcas
// ----------------------
export const useBrands = (usuarioId?: number) => {
  const query = useQuery({
    queryKey: ['allBrands', usuarioId],
    queryFn: () => fetchBrands(usuarioId!),
    enabled: !!usuarioId,
  });

  if (query.isError) {
    toast.error('Error al cargar marcas');
  }

  return {
    ...query,
    data: query.data?.data || [],
  };
};

// ----------------------
// Hook para agregar marca
// ----------------------
export const useAddBrand = (usuarioId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (brand: { nombre: string }) =>
      addBrandAPI({ ...brand, usuarioId }), // 👈 solo recibe nombre
    onSuccess: () => {
      toast.success('Marca agregada');
      queryClient.invalidateQueries({ queryKey: ['allBrands', usuarioId] });
    },
    onError: () => {
      toast.error('Error al agregar marca');
    },
  });
};

// ----------------------
// Hook para editar marca
// ----------------------
export const useEditBrand = (usuarioId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (brand: Brand) => editBrandAPI({ ...brand, usuarioId }),
    onSuccess: () => {
      toast.success('Marca actualizada');
      queryClient.invalidateQueries({ queryKey: ['allBrands', usuarioId] });
    },
    onError: () => {
      toast.error('Error al actualizar marca');
    },
  });
};

// ----------------------
// Hook para eliminar marca
// ----------------------
export const useDeleteBrand = (usuarioId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteBrandAPI(id, usuarioId),
    onSuccess: () => {
      toast.success('Marca eliminada');
      queryClient.invalidateQueries({ queryKey: ['allBrands', usuarioId] });
    },
    onError: () => {
      toast.error('Error al eliminar marca');
    },
  });
};
