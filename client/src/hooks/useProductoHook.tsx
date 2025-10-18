
import { addProducto, deleteProducto, editProducto, fetchProductos, Producto, ProductoInit } from '@/apis/producto';
import { Productos } from '@/interface';
import { showErrorToast } from '@/utils/errorHandler';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

// ----------------------
// Hook para listar productos
// ----------------------
interface ProductoResponse {
  data: Productos[];
  total: number;
}

export const useProductosHook = (
  usuarioId?: number,
  pageIndex = 0,
  pageSize = 10
) => {
  const query = useQuery<ProductoResponse, Error>({
    queryKey: ["allProductos", usuarioId, pageIndex, pageSize],
    queryFn: () => fetchProductos(usuarioId!, pageIndex, pageSize),
    enabled: !!usuarioId,
    staleTime: 2 * 60 * 1000,
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(`Error al cargar los Productos: ${query.error?.message || 'Unknown error'}`);
    }
  }, [query.isError, query.error]);

  return {
    ...query,
    data: query.data?.data || [],
    total: query.data?.total || 0,
  };
};



// ----------------------
// Hook para agregar producto
// ----------------------
export const useAddProducto = (usuarioId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (producto: ProductoInit) => addProducto({ ...producto, usuarioId }),
    onSuccess: () => {
      toast.success('Producto agregado');
      queryClient.invalidateQueries({ queryKey: ['allProductos', usuarioId] });
    },
    onError: () => {
      toast.error('Error al agregar producto');
    },
  });
};

// ----------------------
// Hook para editar producto
// ----------------------
export const useEditProducto = (usuarioId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (producto: Producto) => editProducto({ ...producto, usuarioId }),
    onSuccess: () => {
      toast.success('Producto actualizado');
      queryClient.invalidateQueries({ queryKey: ['allProductos', usuarioId] });
    },
    onError: () => {
      toast.error('Error al actualizar producto');
    },
  });
};

// ----------------------
// Hook para eliminar producto
// ----------------------
export const useDeleteProducto = (usuarioId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProducto(id, usuarioId),
    onSuccess: () => {
      toast.success('Producto eliminado');
      queryClient.invalidateQueries({ queryKey: ['allProductos', usuarioId] });
    },
    onError:showErrorToast
  });
};



// hooks/useProductoHook.ts (añadir esta función)

export const useProductoById = (usuarioId: number, productId: string | undefined) => {
  const { data: productosData, isLoading, isError } = useProductosHook(usuarioId, 0, 1000); // Obtener todos los productos
  
  return {
    data: productosData?.find((p: Productos) => p.id === parseInt(productId || '')),
    isLoading,
    isError,
    refetch: () => {} // No necesitamos refetch para este caso
  };
};