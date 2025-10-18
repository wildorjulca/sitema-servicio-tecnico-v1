import { addBrandAPI, Brand, deleteBrandAPI, editBrandAPI, fetchBrands, fetchMarca } from '@/apis';
import { showErrorToast } from '@/utils/errorHandler';
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
    onError: showErrorToast
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
    onError:showErrorToast
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
    onError:showErrorToast
  });
};



export const useMarcas = () => {
  const query = useQuery({
    queryKey: ["marcas"], // Key única para el cache
    queryFn: fetchMarca,   // Función que llama a la API
  });

  if (query.isError) {
    toast.error("Error al cargar marcas sin pag");
  }


  return {
    ...query,
    data: query.data?.data || [], // Extrae el array de datos
  };
};