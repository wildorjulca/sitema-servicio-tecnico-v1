import { addBrandAPI, Brand, deleteBrandAPI, editBrandAPI, fetchBrands } from '@/apis';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// ----------------------
// Hook para listar marcas
// ----------------------
export const useBrands = (usuarioId: number) => {
    const query = useQuery({
        queryKey: ['allBrands', usuarioId],
        queryFn: () => fetchBrands(usuarioId),
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

export const useAddBrand = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (brand: Brand) => addBrandAPI(brand),
        onSuccess: () => {
            toast.success('Marca agregada');
            queryClient.invalidateQueries({ queryKey: ['allBrands'] });
        },
        onError: () => {
            toast.error('Error al agregar marca');
        },
    });
};

// ----------------------
// Hook para editar marca
// ----------------------

export const useEditBrand = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (brand: Brand) => editBrandAPI(brand),
        onSuccess: () => {
            toast.success('Marca actualizada');
            queryClient.invalidateQueries({ queryKey: ['allBrands'] });
        },
        onError: () => {
            toast.error('Error al actualizar marca');
        },
    });
};

// ----------------------
// Hook para eliminar marca
// ----------------------
export const useDeleteBrand = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, usuarioId }: { id: number; usuarioId: number }) => deleteBrandAPI(id, usuarioId),
        onSuccess: () => {
            toast.success('Marca eliminada');
            queryClient.invalidateQueries({ queryKey: ['allBrands'] });
        },
        onError: () => {
            toast.error('Error al eliminar marca');
        },
    });
};
