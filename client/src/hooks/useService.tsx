import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

import { Estado, Servicio } from '@/interface/types';
import { entregarServicio, fetchEstadoServ, fetchService, filtreClient, obtenerEquiposPorCliente, servicioReparacion1, servicioReparacion2 } from '@/apis/servicio';

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
// Hook para listar estados del servicio pediente , etc
// ----------------------
export const useEstadoHook = () => {
  const query = useQuery<{ data: Estado[] }, Error>({
    queryKey: ["estado"],
    queryFn: () =>
      fetchEstadoServ(),
  });

  if (query.isError) {
    toast.error("Error al cargar los estados");
  }

  return {
    ...query,
    data: query.data?.data || [],
  };
};

// ----------------------
// Hook para listar  mot ingresos
// ----------------------
export const useMot_IngHook = () => {
  const query = useQuery<{ data: Estado[] }, Error>({
    queryKey: ["mot"],
    queryFn: () =>
      fetchEstadoServ(),
  });

  if (query.isError) {
    toast.error("Error al cargar los motivos ingreso service");
  }

  return {
    ...query,
    data: query.data?.data || [],
  };
};


// ----------------------
// Hook para filtrar cliente 
// ----------------------

export const useFiltreClient = (filtro: string) => {
  const query = useQuery({
    queryKey: ["clientes", filtro],
    queryFn: () => filtreClient(filtro),
    enabled: !!filtro, // solo corre si existe filtro
  });

  if (query.isError) {
    toast.error("Error al filtrar clientes");
  }

  return {
    ...query,
    data: query.data?.data || [],
  };
};

// ----------------------
// Hook para filtrar equipos por cliente
// ----------------------
// hooks/useService.ts
export const useEquiposPorCliente = (cliente_id?: number) => {
  const query = useQuery({
    queryKey: ["red", cliente_id],
    queryFn: () => {
      if (!cliente_id) {
        throw new Error("cliente_id es requerido");
      }
      return obtenerEquiposPorCliente(cliente_id);
    },
    enabled: !!cliente_id,
    retry: false,
  });

  useEffect(() => {
    if (query.isError) {
      toast.error("Error al cargar equipos del cliente");
    }
  }, [query.isError]);

  // ✅ Retornar directamente los datos (que son el array)
  return {
    ...query,
    data: query.data || [], // query.data ya es el array de equipos
  };
};

// ----------------------
// Hook para  la resepcion de los equipos 
// ----------------------

export const useServicioReparacion1 = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: servicioReparacion1,
    onSuccess: () => {
      toast.success("Servicio actualizado (paso 1)");
      queryClient.invalidateQueries({ queryKey: ["reparaciones"] });
    },
    onError: () => {
      toast.error("Error al actualizar el servicio (paso 1)");
    },
  });
};

// ----------------------
// Hook para reparar el equipo 
// ----------------------

export const useServicioReparacion2 = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: servicioReparacion2,
    onSuccess: () => {
      toast.success("Servicio actualizado (paso 2)");
      queryClient.invalidateQueries({ queryKey: ["reparaciones"] });
    },
    onError: () => {
      toast.error("Error al actualizar el servicio (paso 2)");
    },
  });
};

// ----------------------
// Hook para finalizar el servicio al entregar al cliente su equipo qe dejo en la tienda
// ----------------------


export const useEntregarServicio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: entregarServicio,
    onSuccess: () => {
      toast.success("Servicio entregado correctamente");
      queryClient.invalidateQueries({ queryKey: ["reparaciones"] });
    },
    onError: () => {
      toast.error("Error al entregar el servicio");
    },
  });
};
// hooks/para detalles del servicio completo (añadir esta función)

export const useServiceyId = (usuarioId: number, idServicio: string | undefined) => {
  const { data: serviceData, isLoading, isError } = useServicioHook(usuarioId, 0, 1000); // Obtener todos los productos

  return {
    data: serviceData?.find((p: Servicio) => p.idServicio === parseInt(idServicio || '')),
    isLoading,
    isError,
    refetch: () => { } // No necesitamos refetch para este caso
  };
};