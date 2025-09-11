import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { ServicioEquipo } from '@/interface';
import { addServicioEquipoAPI, deleteServicioEquipoAPI, editServicioEquipoAPI, fetchServ_equipo } from '@/apis/servicio_equipo';
import { fetchMarca } from '@/apis';

// Definir la interfaz para la respuesta del API
interface Servicio_e {
  data: ServicioEquipo[];
  total: number;
}

export const useServicioEquipoHook = (
  usuarioId?: number,
  pageIndex = 0,
  pageSize = 10,
  filtros?: {
    filtroMarca?: number; // Cambiado de string a number

  }
) => {
  const query = useQuery<Servicio_e, Error>({
    queryKey: ["serEq", usuarioId, pageIndex, pageSize, filtros?.filtroMarca], // Eliminados filtros no usados
    queryFn: () =>
      fetchServ_equipo(
        usuarioId!,
        pageIndex,
        pageSize,
        filtros?.filtroMarca, // Solo enviamos este filtro
      ),
    enabled: !!usuarioId,
    staleTime: 0, // fuerza refetch inmediato
    placeholderData: (prev) => prev, // equivalente a keepPreviousData
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(`Error al cargar servicio-equipo: ${query.error?.message || 'Unknown error'}`);
    }
  }, [query.isError, query.error]);

  return {
    ...query,
    data: query.data?.data || [],
    total: query.data?.total || 0,
  };
};



// ----------------------
// Hook para servicio equipos
// ----------------------

export const useAddServicioEqHook = (usuarioId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (serv: ServicioEquipo) =>
      addServicioEquipoAPI({ ...serv, usuarioId }), // 👈 solo recibe nombre
    onSuccess: () => {
      toast.success('servicio equipo agregada');
      queryClient.invalidateQueries({ queryKey: ['serEq', usuarioId] });
    },
    onError: () => {
      toast.error('Error al servicio equipos');
    },
  });
};

// ----------------------
// Hook para editar marca
// ----------------------
export const useEditServicioEqHook = (usuarioId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (serv: ServicioEquipo) => {
      console.log("➡️ editando marca:", {
        EQUIPO_idEquipo: serv.EQUIPO_idEquipo,
        MARCA_idMarca: serv.MARCA_idMarca,
        equipo: serv.EQUIPO_idEquipo,
        modelo: serv.modelo,
        serie: serv.serie,
        cod: serv.codigo_barras,

        usuarioId
      });

      return editServicioEquipoAPI({ ...serv, usuarioId });
    },
    onSuccess: () => {
      toast.success('servicio equipo actualizada');
      queryClient.invalidateQueries({ queryKey: ['serEq', usuarioId] });
    },
    onError: () => {
      toast.error('Error al actualizar servicio equipo');
    },
  });
};


// ----------------------
// Hook para eliminar servicio equipo
// ----------------------
export const useDeleteServicioEqHook = (usuarioId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteServicioEquipoAPI(id, usuarioId),
    onSuccess: () => {
      toast.success('servicio equipo eliminado');
      queryClient.invalidateQueries({ queryKey: ['serEq', usuarioId] });
    },
    onError: () => {
      toast.error('Error aliminar servicio equipo');
    },
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