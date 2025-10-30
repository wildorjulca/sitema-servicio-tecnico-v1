// hooks/useRepuestosWebSocket.ts
import { useEffect, useRef, useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const useRepuestosWebSocket = (servicio_id?: number) => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    try {
      socketRef.current = new WebSocket('ws://localhost:3005');
      
      socketRef.current.onopen = () => {
        console.log('✅ WebSocket conectado para repuestos');
        setIsConnected(true);
      };

      socketRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 WebSocket Repuestos - Evento recibido:', data);
          
          // Verificar si el evento es para este servicio específico
          if (data.servicio_id === servicio_id) {
            
            // Manejar repuestos agregados
            if (data.tipo === 'repuestos_agregados') {
              console.log('🔄 Repuestos agregados - Actualizando cache...');
              
              // Invalidar queries para forzar re-fetch
              queryClient.invalidateQueries({ 
                queryKey: ["repuestos-servicio", servicio_id?.toString()] 
              });
              queryClient.invalidateQueries({ 
                queryKey: ["servicio", servicio_id?.toString()] 
              });
              
              // Mostrar notificación si no es del usuario actual
              const currentUserId = localStorage.getItem('userId');
              if (data.usuario_id && data.usuario_id.toString() !== currentUserId) {
                toast.success(`📦 ${data.repuestos_agregados} repuesto(s) agregado(s)`);
              }
            }
            // Manejar repuestos eliminados
            else if (data.tipo === 'repuestos_eliminados') {
              console.log('🗑️ Repuestos eliminados - Actualizando cache...');
              
              queryClient.invalidateQueries({ 
                queryKey: ["repuestos-servicio", servicio_id?.toString()] 
              });
              queryClient.invalidateQueries({ 
                queryKey: ["servicio", servicio_id?.toString()] 
              });
              
              const currentUserId = localStorage.getItem('userId');
              if (data.usuario_id && data.usuario_id.toString() !== currentUserId) {
                toast.success(`🗑️ ${data.repuestos_eliminados} repuesto(s) eliminado(s)`);
              }
            }
            // Manejar otros tipos de actualizaciones del servicio
            else if (data.nuevo_estado) {
              console.log('🔄 Estado del servicio actualizado:', data.nuevo_estado);
              queryClient.invalidateQueries({ 
                queryKey: ["servicio", servicio_id?.toString()] 
              });
            }
          }
        } catch (error) {
          console.error('❌ Error procesando mensaje WebSocket:', error);
        }
      };

      socketRef.current.onclose = () => {
        console.log('❌ WebSocket repuestos desconectado');
        setIsConnected(false);
        // Reconectar después de 3 segundos
        setTimeout(() => {
          if (servicio_id) {
            console.log('🔄 Intentando reconectar WebSocket...');
            connect();
          }
        }, 3000);
      };

      socketRef.current.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
      };

    } catch (error) {
      console.error('Error inicializando WebSocket repuestos:', error);
    }
  }, [queryClient, servicio_id]);

  useEffect(() => {
    if (servicio_id) {
      console.log('🔌 Iniciando WebSocket para servicio:', servicio_id);
      connect();
    }
    
    return () => {
      if (socketRef.current) {
        console.log('🔌 Cerrando WebSocket para servicio:', servicio_id);
        socketRef.current.close();
      }
    };
  }, [connect, servicio_id]);

  return { isConnected };
};