'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useUser } from '@/hooks/useUser'
import { useServicioReparacion1 } from '@/hooks/useService'

interface ServiceData {
  motivo_ingreso_id: number | null
  descripcion_motivo: string
  observacion: string
  usuario_recibe_id: number | null
  servicio_equipos_id: number | null
  cliente_id: number | null
  pasoActual: number
  precio_final?: number // <- Agregar este campo
}

interface ServiceContextType {
  serviceData: ServiceData
  updateServiceData: (data: Partial<ServiceData>) => void
  resetService: () => void
  submitService: (precioFinal?: number) => Promise<{ success: boolean; data?: any; error?: string }> // <- CAMBIAR aquí
  isLoading: boolean
  setPasoActual: (paso: number) => void
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined)

const initialServiceData: ServiceData = {
  motivo_ingreso_id: null,
  descripcion_motivo: '',
  observacion: '',
  usuario_recibe_id: null,
  servicio_equipos_id: null,
  cliente_id: null,
  pasoActual: 1,
  precio_final: undefined // <- Agregar al initial
}

export function ServiceProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser()
  const [serviceData, setServiceData] = useState<ServiceData>(initialServiceData)
  
  const { mutateAsync: crearServicio, isPending: isLoading } = useServicioReparacion1()

  // Cargar datos guardados
  useEffect(() => {
    const saved = localStorage.getItem('serviceData')
    if (saved) {
      try {
        setServiceData(JSON.parse(saved))
      } catch (error) {
        console.error('Error loading saved service data:', error)
      }
    }
  }, [])

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem('serviceData', JSON.stringify(serviceData))
  }, [serviceData])

  // Setear usuario automáticamente
  useEffect(() => {
    if (user?.id) {
      setServiceData(prev => ({
        ...prev,
        usuario_recibe_id: user.id
      }))
    }
  }, [user])

  const updateServiceData = (data: Partial<ServiceData>) => {
    setServiceData(prev => ({ ...prev, ...data }))
  }

  const setPasoActual = (paso: number) => {
    setServiceData(prev => ({ ...prev, pasoActual: paso }))
  }

  const resetService = () => {
    setServiceData(initialServiceData)
    localStorage.removeItem('serviceData')
  }

  // ✅ FUNCIÓN submitService CORREGIDA - agregar parámetro precioFinal
  const submitService = async (precioFinal?: number): Promise<{ success: boolean; data?: any; error?: string }> => {
    console.log('🔍 === INICIANDO ENVÍO DE SERVICIO ===');
    console.log('📦 serviceData completo:', JSON.stringify(serviceData, null, 2));
    console.log('💰 Precio final recibido como parámetro:', precioFinal);
    
    // Validar campos obligatorios del SP
    const camposObligatorios = {
      motivo_ingreso_id: serviceData.motivo_ingreso_id,
      usuario_recibe_id: serviceData.usuario_recibe_id,
      servicio_equipos_id: serviceData.servicio_equipos_id,
      cliente_id: serviceData.cliente_id
    };
    
    console.log('✅ Validación de campos obligatorios:', camposObligatorios);
    
    const camposFaltantes = Object.entries(camposObligatorios)
      .filter(([_, value]) => !value)
      .map(([key]) => key);
    
    if (camposFaltantes.length > 0) {
      console.error('❌ Campos faltantes:', camposFaltantes);
      return { 
        success: false, 
        error: `Datos incompletos: ${camposFaltantes.join(', ')}` 
      }
    }

    // Preparar payload para enviar - USAR precioFinal del parámetro
    const payload: any = {
      motivo_ingreso_id: serviceData.motivo_ingreso_id!,
      descripcion_motivo: serviceData.descripcion_motivo,
      observacion: serviceData.observacion,
      usuario_recibe_id: serviceData.usuario_recibe_id!,
      servicio_equipos_id: serviceData.servicio_equipos_id!,
      cliente_id: serviceData.cliente_id!
    };

    // DECISIÓN DE PRECIO: parámetro > contexto > motivo (en SP)
    if (precioFinal !== undefined) {
      payload.precio_final = precioFinal;
      console.log('🎯 Usando precio del parámetro:', precioFinal);
    } else {
      console.log('🎯 No se especificó precio, SP usará precio del motivo');
    }

    console.log('🚀 Payload FINAL a enviar:', JSON.stringify(payload, null, 2));
    console.log('📤 Llamando a crearServicio...');

    try {
      const data = await crearServicio(payload);
      
      console.log('🎉 Respuesta del servidor:', data);
      console.log('✅ Servicio registrado exitosamente');
      
      resetService();
      return { success: true, data };
    } catch (error: any) {
      console.error('💥 Error al registrar servicio:');
      console.error('📌 Mensaje de error:', error?.message);
      console.error('📌 Error completo:', error);
      
      if (error?.response) {
        console.error('📡 Response error:', error.response.data);
        console.error('🔧 Status:', error.response.status);
      }
      
      return { 
        success: false, 
        error: error?.message || 'Error al registrar servicio' 
      };
    } finally {
      console.log('🔚 === FIN DEL ENVÍO ===');
    }
  }

  return (
    <ServiceContext.Provider value={{
      serviceData,
      updateServiceData,
      resetService,
      submitService,
      isLoading,
      setPasoActual
    }}>
      {children}
    </ServiceContext.Provider>
  )
}

export function useService() {
  const context = useContext(ServiceContext)
  if (context === undefined) {
    throw new Error('useService must be used within a ServiceProvider')
  }
  return context
}