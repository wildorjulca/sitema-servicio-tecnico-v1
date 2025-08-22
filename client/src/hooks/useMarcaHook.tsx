import { addBrandAPI, Brand, deleteBrandAPI, editBrandAPI, fetchBrands } from '@/apis';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// ----------------------
// Hook para listar marcas
// ----------------------

interface BrandResponse {
  data: { idMarca: number; nombre: string; usuarioId?: number }[];
  total: number;
}

export const useBrands = (
  usuarioId?: number,
  pageIndex = 0,
  pageSize = 10
) => {
  const query = useQuery<BrandResponse, Error>({
    queryKey: ["allBrands", usuarioId, pageIndex, pageSize],
    queryFn: () => fetchBrands(usuarioId!, pageIndex, pageSize),
    enabled: !!usuarioId,
    staleTime: 2 * 60 * 1000,
  });

  if (query.isError) {
    toast.error("Error al cargar marcas");
  }

  return {
    ...query,
    data: query.data?.data || [],
    total: query.data?.total || 0, // Devolver el total
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
    mutationFn: (brand: Brand) => {
      console.log("➡️ editando marca:", {
        id: brand.id,
        nombre: brand.nombre,
        usuarioId
      });

      return editBrandAPI({ ...brand, usuarioId });
    },
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
