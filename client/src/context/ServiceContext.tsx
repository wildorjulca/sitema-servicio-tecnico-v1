// contexts/ServiceContext.tsx
'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useUser } from '@/hooks/useUser'
import { useServicioReparacion1 } from '@/hooks/useService'

interface ServiceData {
  // Paso 1: Información del cliente
  cliente: {
    id: number | null
    nombre: string
    apellidos: string
    documento: string
  } | null
  
  // Paso 2: Información del equipo
  equipo: {
    id: number | null
    tipo: string
    marca: string
    modelo: string
    serie: string
    servicio_equipos_id: number | null // ID de la relación en servicio_equipos
  } | null
  
  // Paso 3: Detalles del servicio
  servicio: {
    fechaIngreso: string
    motivo_ingreso_id: number | null
    descripcion_motivo: string
    observacion: string
  }
  
  // Metadata
  usuario_recibe_id: number | null
  estado: 'incompleto' | 'completo' | 'enviado'
}

interface ServiceContextType {
  serviceData: ServiceData
  setCliente: (cliente: ServiceData['cliente']) => void
  setEquipo: (equipo: ServiceData['equipo']) => void
  setServicio: (servicio: Partial<ServiceData['servicio']>) => void
  resetService: () => void
  submitService: () => Promise<{ success: boolean; data?: any; error?: string }>
  isLoading: boolean
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined)

const initialServiceData: ServiceData = {
  cliente: null,
  equipo: null,
  servicio: {
    fechaIngreso: new Date().toISOString(),
    motivo_ingreso_id: null,
    descripcion_motivo: '',
    observacion: ''
  },
  usuario_recibe_id: null,
  estado: 'incompleto'
}

export function ServiceProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser()
  const [serviceData, setServiceData] = useState<ServiceData>(initialServiceData)
  
  // Usamos el hook personalizado para el servicio de reparación
  const { 
    mutateAsync: crearServicio, 
    isPending: isLoading 
  } = useServicioReparacion1()

  // Cargar datos guardados del localStorage al iniciar
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

  // Guardar en localStorage cuando cambien los datos
  useEffect(() => {
    localStorage.setItem('serviceData', JSON.stringify(serviceData))
  }, [serviceData])

  // Setear el usuario que recibe
  useEffect(() => {
    if (user?.id) {
      setServiceData(prev => ({
        ...prev,
        usuario_recibe_id: user.id
      }))
    }
  }, [user])

  const setCliente = (cliente: ServiceData['cliente']) => {
    setServiceData(prev => ({ 
      ...prev, 
      cliente,
      estado: cliente ? 'completo' : 'incompleto'
    }))
  }

  const setEquipo = (equipo: ServiceData['equipo']) => {
    setServiceData(prev => ({ 
      ...prev, 
      equipo,
      estado: equipo ? 'completo' : 'incompleto'
    }))
  }

  const setServicio = (servicio: Partial<ServiceData['servicio']>) => {
    setServiceData(prev => ({
      ...prev,
      servicio: { ...prev.servicio, ...servicio }
    }))
  }

  const resetService = () => {
    setServiceData(initialServiceData)
    localStorage.removeItem('serviceData')
  }

  const submitService = async (): Promise<{ success: boolean; data?: any; error?: string }> => {
    if (!serviceData.cliente?.id || !serviceData.equipo?.servicio_equipos_id || !serviceData.usuario_recibe_id) {
      return { success: false, error: 'Datos incompletos' }
    }

    try {
      // Usamos el hook personalizado en lugar de fetch directo
      const data = await crearServicio({
        motivo_ingreso_id: serviceData.servicio.motivo_ingreso_id,
        descripcion_motivo: serviceData.servicio.descripcion_motivo,
        observacion: serviceData.servicio.observacion,
        usuario_recibe_id: serviceData.usuario_recibe_id,
        servicio_equipos_id: serviceData.equipo.servicio_equipos_id,
        cliente_id: serviceData.cliente.id
      })

      resetService()
      return { success: true, data }
    } catch (error: any) {
      // Manejo de errores específico del hook
      return { 
        success: false, 
        error: error?.message || 'Error al registrar servicio' 
      }
    }
  }

  return (
    <ServiceContext.Provider value={{
      serviceData,
      setCliente,
      setEquipo,
      setServicio,
      resetService,
      submitService,
      isLoading
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