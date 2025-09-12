import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { ServicioEquipo } from '@/interface';
import { addServicioEquipoAPI, deleteServicioEquipoAPI, editServicioEquipoAPI } from '@/apis/servicio_equipo';
import { fetchMarca } from '@/apis';
import { Servicio } from '@/interface/types';
import { fetchService } from '@/apis/servicio';

// Definir la interfaz para la respuesta del API


export const useServicioHook = (
  usuarioId?: number,
  pageIndex = 0,
  pageSize = 10,
  filtros?: {
    estadoId?: number;
    clienteId?: number;
  }
) => {
  const query = useQuery<{ data: Servicio[]; total: number }, Error>({
    queryKey: [
      "reparaciones",
      usuarioId,
      pageIndex,
      pageSize,
      filtros?.estadoId,
      filtros?.clienteId
    ],
    queryFn: () =>
      fetchService(
        usuarioId!,
        pageIndex,
        pageSize,
        filtros?.estadoId,    // Filtro por estado
        filtros?.clienteId    // Filtro por cliente
      ),
    enabled: !!usuarioId,
    staleTime: 0,
    placeholderData: (prev) => prev,
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(`Error al cargar servicios: ${query.error?.message || 'Unknown error'}`);
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