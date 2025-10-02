// hooks/useWebSocket.ts
import { useEffect, useRef, useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const useWebSocket = () => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    try {
      socketRef.current = new WebSocket('ws://localhost:3005');
      
      socketRef.current.onopen = () => {
        console.log('✅ WebSocket conectado');
        setIsConnected(true);
      };

      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('📨 WebSocket:', data.type);
        
        // 🔥 SIMPLE: Invalidar la query para forzar refetch
        queryClient.invalidateQueries({ queryKey: ["reparaciones"] });
        
        // Notificaciones
        if (data.type === 'SERVICIO_CREADO') {
          toast.success(`Nuevo servicio: ${data.servicio.codigoSeguimiento}`);
        } else if (data.type === 'SERVICIO_ACTUALIZADO') {
          toast.success(`Servicio ${data.servicioId} actualizado`);
        }
      };

      socketRef.current.onclose = () => {
        console.log('❌ WebSocket desconectado');
        setIsConnected(false);
        setTimeout(connect, 5000); // Reconectar en 5 segundos
      };

    } catch (error) {
      console.error('Error WebSocket:', error);
    }
  }, [queryClient]);

  useEffect(() => {
    connect();
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connect]);

  return { isConnected };
};