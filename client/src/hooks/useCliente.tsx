import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { Clientes, ClienteEdit } from '@/interface';
import { addClienteAPI, deleteClienteAPI, editClienteAPI, fetchCliente } from '@/apis/cliente';



// Definir la interfaz para la respuesta del API

interface Response {
  data: Clientes[];
  total: number;
}

export const useClienteHook = (
  usuarioId?: number,
  pageIndex = 0,
  pageSize = 10
) => {
  const query = useQuery<Response, Error>({
    queryKey: ["ffcliente", usuarioId, pageIndex, pageSize], // Corregir typo en queryKey
    queryFn: () => fetchCliente(usuarioId!, pageIndex, pageSize),
    enabled: !!usuarioId,
    staleTime: 5 * 60 * 1000, // 2 minutos
  });

  // Manejar errores con toast en useEffect para evitar múltiples disparos
  useEffect(() => {
    if (query.isError) {
      toast.error(`Error al cargar los clientes: ${query.error?.message || 'Unknown error'}`);
    }
  }, [query.isError, query.error]);

  return {
    ...query,
    data: query.data?.data || [], // Fallback para datos vacíos
    total: query.data?.total || 0, // Fallback para total
  };
};



// ----------------------
// Hook para agregar cliente
// ----------------------

export const useAddClienteHook = (usuarioId: number) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (cliente: ClienteEdit) =>
      addClienteAPI({ ...cliente, usuarioId }),
    onSuccess: () => {
      toast.success('cliente agregada');
      queryClient.invalidateQueries({ queryKey: ['ffcliente', usuarioId] });
    },
    onError: () => {
      toast.error('Error al agregar cliente');
    },
  });
};


// ----------------------
// Hook para editar cliente
// ----------------------
export const useEditClienteHook = (usuarioId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cliente: ClienteEdit) => {
      console.log("➡️ editando cliente:", {
        id: cliente.idCliente,
        nombre: cliente.nombre,
        apellidos: cliente.apellidos,
        tipo_doc_id: cliente.tipo_doc_id,
        numero_doc: cliente.numero_documento,
        direccion: cliente.direccion,
        telefono: cliente.telefono,
        usuarioId
      });

      return editClienteAPI({ ...cliente, usuarioId });
    },
    onSuccess: () => {
      toast.success('cliente actualizada');
      queryClient.invalidateQueries({ queryKey: ['ffcliente', usuarioId] });
    },
    onError: () => {
      toast.error('Error al actualizar cliente');
    },
  });
};


// ----------------------
// Hook para eliminar cliente
// ----------------------

export const useDeleteClienteHook = (usuarioId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteClienteAPI(id, usuarioId),
    onSuccess: () => {
      toast.success('cliente eliminada');
      queryClient.invalidateQueries({ queryKey: ['ffcliente', usuarioId] });
    },
    onError: () => {
      toast.error('Error al eliminar cliente');
    },
  });
};
