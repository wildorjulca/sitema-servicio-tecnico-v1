import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useEffect, useMemo } from 'react';

import { Estado, Servicio } from '@/interface/types';
import {
  agregarRepuestosSecretaria,
  eliminarRepuestosSecretaria,
  entregarServicio,
  fetchEstadoServ,
  fetchMot_Ingreso,
  fetchService,
  filtreClient,
  filtroProduct,
  finalizarReparacion,
  guardarAvanceTecnico,
  iniciarReparacionService,
  obtenerEquiposPorCliente,
  obtenerRepuestosServicio,
  pagarServicio,
  servicioReparacion1,
  servicioReparacion2
} from '@/apis/servicio';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from './useWebSocket';
import { showErrorToast } from '@/utils/errorHandler';


// ----------------------
// Hook para listar servicios CON WEBSOCKET
// ----------------------
export const useServicioHook = (
  usuarioId?: number,
  pageIndex = 0,
  pageSize = 10,
  filtros?: {
    estadoId?: number;
    clienteId?: number;
  }
) => {
  // 🔥 INICIALIZAR WEBSOCKET - IMPORTANTE: fuera del query
  const { isConnected } = useWebSocket();

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
        filtros?.estadoId,
        filtros?.clienteId
      ),
    enabled: !!usuarioId,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(`Error al cargar servicios: ${query.error?.message || 'Unknown error'}`);
    }
  }, [query.isError, query.error]);

  // 🔥 LOG para debug
  useEffect(() => {
    console.log('🔍 Estado WebSocket:', { isConnected });
    console.log('🔍 Datos servicios:', query.data?.data?.length || 0);
  }, [isConnected, query.data]);

  return {
    ...query,
    data: query.data?.data || [],
    total: query.data?.total || 0,
    isConnected // 🔥 Para mostrar estado de conexión
  };
};

// ----------------------
// Hook para estados del servicio - OPTIMIZADO
// ----------------------
export const useEstadoHook = () => {
  const query = useQuery<{ data: Estado[] }, Error>({
    queryKey: ["estados"],
    queryFn: fetchEstadoServ,
    staleTime: 1000 * 60 * 60, // ✅ 30 minutos (datos estáticos)
    gcTime: 1000 * 60 * 120,    // ✅ 1 hora en cache
  });

  useEffect(() => {
    if (query.isError) {
      toast.error("Error al cargar los estados");
    }
  }, [query.isError]);

  return {
    ...query,
    data: query.data?.data || [],
  };
};

// ----------------------
// Hook para motivos de ingreso - OPTIMIZADO
// ----------------------
export const useMot_IngHook = () => {
  const query = useQuery<{ data: Estado[] }, Error>({
    queryKey: ["motivos-ingreso"],
    queryFn: fetchMot_Ingreso,
    staleTime: 1000 * 60 * 30, // ✅ 30 minutos
    gcTime: 1000 * 60 * 60,    // ✅ 1 hora
  });

  useEffect(() => {
    if (query.isError) {
      toast.error("Error al cargar los motivos de ingreso");
    }
  }, [query.isError]);

  return {
    ...query,
    data: query.data?.data || [],
  };
};

// ----------------------
// Hook para filtrar cliente - OPTIMIZADO
// ----------------------
export const useFiltreClient = (filtro: string) => {
  const query = useQuery({
    queryKey: ["clientes", filtro],
    queryFn: () => filtreClient(filtro),
    enabled: !!filtro,
    staleTime: 1000 * 60 * 10, // ✅ 10 minutos
    gcTime: 1000 * 60 * 15,    // ✅ 15 minutos
  });

  useEffect(() => {
    if (query.isError) {
      toast.error("Error al filtrar clientes");
    }
  }, [query.isError]);

  return {
    ...query,
    data: query.data?.data || [],
  };
};

// ----------------------
// Hook para filtrar productos - OPTIMIZADO
// ----------------------
export const useFiltreProductHook = (nombre: string) => {
  const query = useQuery({
    queryKey: ["productos", nombre],
    queryFn: () => filtroProduct(nombre),
    enabled: !!nombre,
    staleTime: 1000 * 60 * 10, // ✅ 10 minutos
    gcTime: 1000 * 60 * 15,    // ✅ 15 minutos
  });

  useEffect(() => {
    if (query.isError) {
      toast.error("Error al filtrar productos");
    }
  }, [query.isError]);

  return {
    ...query,
    data: query.data?.data || [],
  };
};

// ----------------------
// Hook para equipos por cliente - OPTIMIZADO
// ----------------------
export const useEquiposPorCliente = (cliente_id?: number) => {
  const query = useQuery({
    queryKey: ["equipos-cliente", cliente_id],
    queryFn: () => {
      if (!cliente_id) {
        throw new Error("cliente_id es requerido");
      }
      return obtenerEquiposPorCliente(cliente_id);
    },
    enabled: !!cliente_id,
    staleTime: 1000 * 60 * 5, // ✅ 5 minutos
    gcTime: 1000 * 60 * 10,   // ✅ 10 minutos
    retry: false,
  });

  useEffect(() => {
    if (query.isError) {
      toast.error("Error al cargar equipos del cliente");
    }
  }, [query.isError]);

  return {
    ...query,
    data: query.data || [],
  };
};

// ----------------------
// Hook para recepción de equipos (Paso 1) - OPTIMIZADO
// ----------------------
export const useServicioReparacion1 = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: servicioReparacion1,
    onSuccess: () => {
      toast.success("Servicio registrado exitosamente (paso 1)");
      queryClient.invalidateQueries({ queryKey: ["reparaciones"] });
    },
    onError: () => {
      toast.error("Error al actualizar el servicio (paso 1)");
    },
  });
};

// ----------------------
// Hook para iniciar reparación - OPTIMIZADO
// ----------------------
export const useIniciarReparacion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ servicioId, usuarioId }: { servicioId: number; usuarioId: number }) => {
      return iniciarReparacionService(servicioId, usuarioId);
    },
    onSuccess: (data, variables) => {
      toast.success("Reparación iniciada correctamente");

      // ✅ INVALIDAR MÚLTIPLES QUERIES
      queryClient.invalidateQueries({ queryKey: ["reparaciones"] });
      queryClient.invalidateQueries({
        queryKey: ["servicio", variables.servicioId.toString()]
      });
    },
    onError: (error: any) => {
      console.error('Error al iniciar reparación:', error);
      const errorMessage = error.response?.data?.error ||
        error.response?.data?.mensaje ||
        "Error al iniciar la reparación";
      toast.error(errorMessage);
    },
  });
};

// ----------------------
// Hook para reparar equipo (Paso 2) - OPTIMIZADO
// ----------------------
export const useServicioReparacion2 = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: servicioReparacion2,
    onSuccess: (variables) => {
      toast.success("Servicio actualizado correctamente");

      // ✅ INVALIDAR MÚLTIPLES QUERIES
      queryClient.invalidateQueries({ queryKey: ["reparaciones"] });
      queryClient.invalidateQueries({
        queryKey: ["servicio", variables.servicio_id]
      });

      // Redirigir después de 1 segundo
      setTimeout(() => {
        navigate('/dashboard/list');
      }, 1000);
    },
    onError: (error) => {
      console.error('Error al actualizar servicio:', error);
      toast.error("Error al actualizar el servicio");
    },
  });
};

//  s ssjdj------------------


// En hooks/useService.ts - MODIFICAR EL HOOK
export const useGuardarAvanceTecnico = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: guardarAvanceTecnico,
    onSuccess: (data, variables) => {
      toast.success("Avance guardado correctamente");
      
      // ✅ ACTUALIZAR CACHE CON LOS NUEVOS DATOS Y REPUESTOS
      queryClient.setQueryData(
        ["servicio", variables.servicio_id],
        (oldData: any) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            diagnostico: variables.diagnostico,
            solucion: variables.solucion,
            precio: variables.precio_mano_obra,
            repuestos: data.repuestos || [] // ✅ ACTUALIZAR REPUESTOS
          };
        }
      );

      // ✅ INVALIDAR PARA ASEGURAR DATOS ACTUALIZADOS
      queryClient.invalidateQueries({ 
        queryKey: ["servicio", variables.servicio_id] 
      });
    },
    onError: (error) => {
      console.error('Error al guardar avance:', error);
      toast.error("Error al guardar avance");
    },
  });
};

// En hooks/useService.ts - ACTUALIZAR EL HOOK
export const useAgregarRepuestos = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: agregarRepuestosSecretaria,
    onSuccess: (data, variables) => {
      toast.success("Repuestos agregados correctamente");
      
      // ✅ ACTUALIZAR CACHE DEL SERVICIO CON NUEVOS TOTALES
      queryClient.setQueryData(
        ["servicio", variables.servicio_id],
        (oldData: any) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            precioRepuestos: data.data?.total_repuestos || 0,
            precioTotal: data.data?.precio_total || 0,
            // También actualizar la lista de repuestos si es necesario
          };
        }
      );

      // ✅ INVALIDAR PARA REFRESCAR DATOS COMPLETOS
      queryClient.invalidateQueries({ 
        queryKey: ["servicio", variables.servicio_id] 
      });
    },
    onError: (error) => {
      console.error('Error al agregar repuestos:', error);
      toast.error("No se pueden agregar repuestos a servicios terminados o entregados");
    },
  });
};

// ✅ HOOK PARA ELIMINAR REPUESTOS (VERSIÓN CORRECTA)
// hooks/useService.ts - MODIFICA EL HOOK DE ELIMINAR
export const useEliminarRepuestos = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eliminarRepuestosSecretaria,
    onSuccess: (data, variables) => {
      toast.success("Repuestos eliminados correctamente");
      
      // ✅ ACTUALIZAR CACHE DEL SERVICIO
      queryClient.setQueryData(
        ["servicio", variables.servicio_id],
        (oldData: any) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            precioRepuestos: data.data?.total_repuestos || 0,
            precioTotal: data.data?.precio_total || 0,
          };
        }
      );

      // ✅ FORZAR REFRESCO DE REPUESTOS - ESTO ES LO MÁS IMPORTANTE
      queryClient.invalidateQueries({ 
        queryKey: ["repuestos-servicio", variables.servicio_id] 
      });

      // ✅ TAMBIÉN INVALIDAR EL SERVICIO GENERAL
      queryClient.invalidateQueries({ 
        queryKey: ["servicio", variables.servicio_id] 
      });
    },
    onError: (error) => {
      console.error('Error al eliminar repuestos:', error);
      toast.error("Error al eliminar repuestos");
    },
  });
};
export const useFinalizarReparacion = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: finalizarReparacion,
    onSuccess: (data, variables) => {
      toast.success("Reparación finalizada correctamente");

      // Invalidar queries
      queryClient.invalidateQueries({ queryKey: ["reparaciones"] });
      queryClient.invalidateQueries({
        queryKey: ["servicio", variables.servicio_id]
      });

      // Redirigir después de 1 segundo
      setTimeout(() => {
        navigate('/dashboard/list');
      }, 1000);
    },
    onError: (error) => {
      console.error('Error al finalizar reparación:', error);
      toast.error("Error al finalizar reparación");
    },
  });
};

// hooks/useService.ts - AGREGAR ESTE HOOK
export const useObtenerRepuestosServicio = (servicioId: number) => {
  return useQuery({
    queryKey: ['repuestos', servicioId],
    queryFn: () => obtenerRepuestosServicio(servicioId),
    enabled: !!servicioId && servicioId > 0,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 2, // 5 minutos
  });
};

// ----------------------
// Hook para entregar servicio 
// ----------------------
export const useEntregarServicio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: entregarServicio,
    onSuccess: (data, variables) => {
      toast.success("Servicio entregado correctamente");

      // Invalidar las queries para refrescar datos
      queryClient.invalidateQueries({ queryKey: ["servicios"] });
      queryClient.invalidateQueries({
        queryKey: ["servicio", variables.servicio_id.toString()]
      });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Error al entregar el servicio";
      toast.error(errorMessage);
    },
  });
};

// ----------------------
// Hook para pagar el servicio
// ----------------------

export const usePagarServicio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: pagarServicio,
    onSuccess: (data, variables) => {
      toast.success("Servicio pagado correctamente");

      // Invalidar las queries para refrescar datos
      queryClient.invalidateQueries({ queryKey: ["servicios"] });
      queryClient.invalidateQueries({
        queryKey: ["servicio", variables.servicio_id.toString()]
      });
    },
    onError: showErrorToast,
  });
};

// ----------------------
// Hook para servicio por ID - MANTENIDO (pero considera crear endpoint específico)
// ----------------------
export const useServiceyId = (usuarioId: number, idServicio: string | undefined) => {
  const { data: serviceData, isLoading, isError } = useServicioHook(usuarioId, 0, 1000);

  const servicio = useMemo(() => {
    if (!serviceData || !idServicio) return undefined;
    return serviceData.find((p: Servicio) => p.idServicio === parseInt(idServicio || ''));
  }, [serviceData, idServicio]);

  return {
    data: servicio,
    isLoading,
    isError,
    refetch: () => { }
  };
};

// ----------------------
// Hook alternativo para servicio por ID - OPTIMIZADO
// ----------------------
export const useServicioById = (usuarioId: number, idServicio: string | undefined) => {
  const { data: serviceData, isLoading, isError } = useServicioHook(usuarioId, 0, 1000);

  const servicio = useMemo(() => {
    if (!serviceData || !idServicio) return undefined;
    return serviceData.find((p: Servicio) => p.idServicio === parseInt(idServicio));
  }, [serviceData, idServicio]);

  return {
    data: servicio,
    isLoading,
    isError,
    refetch: () => { }
  };
};