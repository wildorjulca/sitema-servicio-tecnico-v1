// components/customer-search.tsx
'use client'
import { useState, useEffect, useCallback } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Search, User, Monitor, ChevronUp, X, Plus, Link, Save, Calendar } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEquiposPorCliente, useFiltreClient, useMot_IngHook } from '@/hooks/useService'
import { useAddServicioEqHook, useServicioEquipoHook } from '@/hooks/useServicioEquipo'
import { useUser } from '@/hooks/useUser'
import { useAddClienteHook } from '@/hooks/useCliente'
import toast from 'react-hot-toast'
import { ServicioEquipo } from '@/interface'
import { useService } from '@/context/ServiceContext'
import CustomerModal from '@/pages/dashboard/cliente/ui/CustomerModal '
import { ServicioEquipoDialog } from '@/pages/dashboard/servicio_equipos/ui/modal'
import { CustomerAPI, CustomerUI, EquipmentUI } from './types'


// Componente Select simplificado - SIN BUSCADOR
function SimpleSelect({
  options,
  value,
  onValueChange,
  placeholder = "Seleccionar...",
  emptyMessage = "No hay opciones disponibles"
}: {
  options: Array<{ id: number; descripcion: string; precio_cobrar: number }>
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  emptyMessage?: string
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-60">
        {options.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          options.map((option) => (
            <SelectItem key={option.id} value={option.id.toString()}>
              <div className="flex justify-between items-center w-full">
                <span>{option.descripcion || 'Sin descripción'}</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  S/. {option.precio_cobrar || 0}
                </span>
              </div>
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  )
}

export default function New_Service() {
  const { user } = useUser()
  const usuarioId = user?.id
  const { serviceData, updateServiceData, submitService, isLoading, setPasoActual } = useService()
  const { data: motivosData, isLoading: loadingMotivos } = useMot_IngHook()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerUI | null>(null)
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentUI | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [showEquipmentModal, setShowEquipmentModal] = useState(false)
  const [showAvailableEquipments, setShowAvailableEquipments] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Estados para los campos del servicio
  const [motivoIngresoId, setMotivoIngresoId] = useState<string>('')
  const [observacion, setObservacion] = useState('')
  const [descripcion_motivo, setDescripcion_motivo] = useState('')

  // Hook para agregar cliente
  const addCliente = useAddClienteHook(usuarioId!)
  // Hook para crear servicio-equipo
  const addServicioEq = useAddServicioEqHook(usuarioId!)

  // Hook clientes
  const { data: customersRaw, isLoading: loadingCustomers, refetch: refetchClients } = useFiltreClient(searchTerm)

  // Hook equipos del cliente - CORREGIDO: usar useCallback para evitar loops
  const { data: equiposRaw, isLoading: loadingEquipos, refetch: refetchEquipos } = useEquiposPorCliente(
    selectedCustomer?.id || null
  )

  // Hook para todos los equipos disponibles
  const { data: allEquipos, isLoading: loadingAllEquipos, refetch: refetchAllEquipos } = useServicioEquipoHook(
    usuarioId,
    0,
    100
  )

  // Mapear clientes API → UI
  const customers: CustomerUI[] = customersRaw?.map((c: CustomerAPI) => ({
    id: c.idCliente,
    nombre: c.nombre,
    apellidos: c.apellidos,
    numero_documento: c.numero_documento,
    tipo_documento: c.tipo_documento,
    direccion: c.direccion,
    telefono: c.telefono,
  })) ?? []

  // Mapear equipos del cliente API → UI - CORREGIDO: simplificado
  const customerEquipments: EquipmentUI[] = (() => {
    try {
      const equiposArray = Array.isArray(equiposRaw) ? equiposRaw : 
                          (equiposRaw?.data || []);
      
      return equiposArray.map((eq: any) => ({
        id: eq.EQUIPO_idEquipo || eq.idequipo,
        customerId: selectedCustomer?.id ?? 0,
        type: eq.nombre_equipo || eq.nombreequipo || 'N/A',
        brand: eq.nombre_marca || 'N/A',
        model: eq.modelo || 'N/A',
        serialNumber: eq.serie || 'N/A',
        lastServiceDate: eq.ultimo_servicio
          ? new Date(eq.ultimo_servicio).toLocaleDateString()
          : 'N/A',
        servicio_equipos_id: eq.idServicioEquipos
      }));
    } catch (error) {
      console.error('Error mapeando equipos:', error);
      return [];
    }
  })()

  // Mapear equipos disponibles
  const availableEquipments: ServicioEquipo[] = allEquipos?.data || allEquipos || []

  // Preparar datos seguros para los motivos
  const safeMotivosData = (motivosData || []).map((m: any) => ({
    id: Number(m.idMotivo),
    descripcion: String(m.descripcion || 'Sin descripción'),
    precio_cobrar: Number(m.precio_cobrar) || 0
  }))

  const selectedMotivo = safeMotivosData.find(m => m.id === parseInt(motivoIngresoId))

  // CORREGIDO: Sincronización sin loops infinitos
  useEffect(() => {
    if (serviceData.cliente_id && !selectedCustomer) {
      const clienteEncontrado = customers.find(c => c.id === serviceData.cliente_id)
      if (clienteEncontrado) {
        setSelectedCustomer(clienteEncontrado)
      }
    }
  }, [serviceData.cliente_id, selectedCustomer]) // Removido customers de dependencias

  // CORREGIDO: useEffect para equipos
  useEffect(() => {
    if (serviceData.servicio_equipos_id && selectedCustomer && !selectedEquipment) {
      const equipoEncontrado = availableEquipments.find(e => e.idServicioEquipos === serviceData.servicio_equipos_id)
      if (equipoEncontrado) {
        const uiEquipment: EquipmentUI = {
          id: equipoEncontrado.EQUIPO_idEquipo,
          customerId: selectedCustomer.id,
          type: equipoEncontrado.nombre_equipo || '',
          brand: equipoEncontrado.nombre_marca || '',
          model: equipoEncontrado.modelo || '',
          serialNumber: equipoEncontrado.serie || '',
          lastServiceDate: 'N/A',
          servicio_equipos_id: equipoEncontrado.idServicioEquipos
        }
        setSelectedEquipment(uiEquipment)
      }
    }
  }, [serviceData.servicio_equipos_id, selectedCustomer, selectedEquipment, availableEquipments])

  // CORREGIDO: Sincronizar campos del formulario con contexto
  useEffect(() => {
    if (serviceData.motivo_ingreso_id !== null && serviceData.motivo_ingreso_id !== undefined) {
      setMotivoIngresoId(serviceData.motivo_ingreso_id.toString())
    }
    if (serviceData.observacion !== undefined) {
      setObservacion(serviceData.observacion)
    }
    if (serviceData.descripcion_motivo !== undefined) {
      setDescripcion_motivo(serviceData.descripcion_motivo)
    }
  }, [serviceData.motivo_ingreso_id, serviceData.observacion, serviceData.descripcion_motivo])

  // CORREGIDO: Función para refetch equipos con useCallback
  const handleRefetchEquipos = useCallback(() => {
    if (selectedCustomer?.id) {
      refetchEquipos()
    }
  }, [selectedCustomer?.id, refetchEquipos])

  const handleSearch = () => setIsSearching(true)

  const handleSelectCustomer = (customer: CustomerUI) => {
    setSelectedCustomer(customer)
    setIsSearching(false)
    setSelectedEquipment(null)
    
    // CORREGIDO: Actualizar contexto inmediatamente
    updateServiceData({
      cliente_id: customer.id,
      servicio_equipos_id: null,
      motivo_ingreso_id: null,
      descripcion_motivo: '',
      observacion: ''
    })

    // Resetear estados locales
    setMotivoIngresoId('')
    setObservacion('')
    setDescripcion_motivo('')

    // Refrescar equipos del cliente
    handleRefetchEquipos()
    
    setPasoActual(2)
  }

  const handleSelectEquipment = (equipment: EquipmentUI) => {
    setSelectedEquipment(equipment)
    updateServiceData({
      servicio_equipos_id: equipment.servicio_equipos_id
    })
    setPasoActual(3)
  }

  const handleClearSelection = () => {
    setSelectedCustomer(null)
    setSelectedEquipment(null)
    setSearchTerm('')
    setMotivoIngresoId('')
    setObservacion('')
    setDescripcion_motivo('')
    
    updateServiceData({
      cliente_id: null,
      servicio_equipos_id: null,
      motivo_ingreso_id: null,
      descripcion_motivo: '',
      observacion: ''
    })
    
    setPasoActual(1)
  }

  // CORREGIDO: Manejo de cambios en tiempo real
  const handleMotivoChange = (value: string) => {
    setMotivoIngresoId(value)
    updateServiceData({
      motivo_ingreso_id: value ? parseInt(value) : null
    })
  }

  const handleObservacionChange = (value: string) => {
    setObservacion(value)
    updateServiceData({ observacion: value })
  }

  const handleDescripcionChange = (value: string) => {
    setDescripcion_motivo(value)
    updateServiceData({ descripcion_motivo: value })
  }

  const handleCustomerCreated = async (payload: any) => {
    if (!usuarioId) {
      toast.error("Usuario no autenticado")
      return
    }
    setIsSubmitting(true)
    try {
      const newCustomer = await addCliente.mutateAsync(payload)
      toast.success("Cliente creado")
      const uiCustomer: CustomerUI = {
        id: newCustomer.idCliente,
        nombre: newCustomer.nombre,
        apellidos: newCustomer.apellidos,
        numero_documento: newCustomer.numero_documento.toString(),
        tipo_documento: "DNI",
        direccion: newCustomer.direccion,
        telefono: newCustomer.telefono?.toString() || ""
      }
      setSelectedCustomer(uiCustomer)
      setShowCustomerModal(false)
      updateServiceData({ cliente_id: uiCustomer.id })
      refetchClients()
      setPasoActual(2)
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.mensaje || "Error desconocido"
      toast.error(`Error: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSelectExistingEquipment = (equipment: ServicioEquipo) => {
    const uiEquipment: EquipmentUI = {
      id: equipment.EQUIPO_idEquipo,
      customerId: selectedCustomer?.id || 0,
      type: equipment.nombre_equipo || '',
      brand: equipment.nombre_marca || '',
      model: equipment.modelo || '',
      serialNumber: equipment.serie || '',
      lastServiceDate: 'N/A',
      servicio_equipos_id: equipment.idServicioEquipos
    }
    setSelectedEquipment(uiEquipment)
    updateServiceData({ servicio_equipos_id: equipment.idServicioEquipos })
    setShowAvailableEquipments(false)
    toast.success("Equipo seleccionado")
    setPasoActual(3)
  }

  const handleCreateNewEquipment = async (equipmentData: any) => {
    if (!selectedCustomer || !usuarioId) {
      toast.error("Seleccione un cliente primero")
      return
    }
    setIsSubmitting(true)
    try {
      const newEquipment = await addServicioEq.mutateAsync(equipmentData)
      const uiEquipment: EquipmentUI = {
        id: newEquipment.EQUIPO_idEquipo,
        customerId: selectedCustomer.id,
        type: newEquipment.nombre_equipo || '',
        brand: newEquipment.nombre_marca || '',
        model: newEquipment.modelo || '',
        serialNumber: newEquipment.serie || '',
        lastServiceDate: 'N/A',
        servicio_equipos_id: newEquipment.idServicioEquipos
      }
      setSelectedEquipment(uiEquipment)
      updateServiceData({ servicio_equipos_id: newEquipment.idServicioEquipos })
      toast.success("Equipo creado y seleccionado")
      setShowEquipmentModal(false)
      refetchAllEquipos()
      setPasoActual(3)
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.mensaje || "Error desconocido"
      toast.error(`Error: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // CORREGIDO: handleSubmitService sin setTimeout problemático
  const handleSubmitService = async () => {
    if (!serviceData.servicio_equipos_id) {
      toast.error("Falta seleccionar un equipo")
      return
    }
    if (!motivoIngresoId) {
      toast.error("Seleccione un motivo de ingreso")
      return
    }

    setIsSubmitting(true)

    try {
      // Actualizar contexto con los datos finales
      updateServiceData({
        motivo_ingreso_id: parseInt(motivoIngresoId),
        descripcion_motivo: descripcion_motivo,
        observacion: observacion
      })

      // Pequeña pausa para asegurar la actualización
      await new Promise(resolve => setTimeout(resolve, 50))

      const result = await submitService()

      if (result.success) {
        toast.success('Servicio registrado exitosamente!')
        handleClearSelection()
      } else {
        toast.error(`Error: ${result.error}`)
      }
    } catch (error: any) {
      toast.error(`Error inesperado: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Variables para la barra de estado
  const clienteCompleto = !!serviceData.cliente_id
  const equipoCompleto = !!serviceData.servicio_equipos_id
  const motivoCompleto = !!serviceData.motivo_ingreso_id

  return (
    <div className="min-h-screen bg-gradient-to-br to-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-3xl font-bold text-[#034693] mb-2 font-sans">
            Gestión de Servicios Técnicos
          </span>
        </div>

        {/* Barra de estado del servicio - CORREGIDO: estructura JSX */}
        <Card className="mb-8 border-blue-200 shadow-lg">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className={`flex items-center gap-2 ${clienteCompleto ? 'text-green-600' : 'text-muted-foreground'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${clienteCompleto ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <User className="h-4 w-4" />
                  </div>
                  <span className="font-medium">Cliente</span>
                </div>
                <div className={`flex items-center gap-2 ${equipoCompleto ? 'text-green-600' : 'text-muted-foreground'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${equipoCompleto ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <Monitor className="h-4 w-4" />
                  </div>
                  <span className="font-medium">Equipo</span>
                </div>
                <div className={`flex items-center gap-2 ${motivoCompleto ? 'text-green-600' : 'text-muted-foreground'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${motivoCompleto ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <Calendar className="h-4 w-4" />
                  </div>
                  <span className="font-medium">Motivo</span>
                </div>
              </div>
              {clienteCompleto && equipoCompleto && motivoCompleto && (
                <Button
                  onClick={handleSubmitService}
                  disabled={isSubmitting || isLoading}
                  className="bg-[#0A5CB8] hover:bg-[#0A5CB8]/90"
                >
                  {isSubmitting || isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Registrando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Registrar Servicio
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Layout de 2 columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Columna izquierda */}
          <div className="space-y-6">
            {/* Búsqueda de clientes */}
            <Card className="border-blue-200 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg text-[#0A5CB8] mb-4 flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Búsqueda de Clientes
                </h3>
                <div className="flex items-center gap-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nombre, apellido o DNI..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <Button
                    onClick={handleSearch}
                    disabled={!searchTerm}
                    size="sm"
                    className="bg-[#0A5CB8] hover:bg-[#0A5CB8]/90"
                  >
                    {loadingCustomers ? "Buscando..." : "Buscar"}
                  </Button>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowCustomerModal(true)}
                  className="w-full border-blue-200 text-[#0A5CB8] hover:bg-blue-50"
                >
                  <Plus className="h-4 w-4 mr-2" /> Nuevo Cliente
                </Button>
                <AnimatePresence>
                  {isSearching && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4"
                    >
                      {customers.length > 0 ? (
                        <div className="max-h-60 overflow-y-auto border border-blue-100 rounded-lg">
                          {customers.map((customer) => (
                            <div
                              key={customer.id}
                              className="p-3 border-b border-blue-50 hover:bg-blue-50 cursor-pointer transition-colors"
                              onClick={() => handleSelectCustomer(customer)}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium text-sm">{customer.nombre} {customer.apellidos}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {customer.numero_documento}
                                  </p>
                                </div>
                                <ChevronUp className="h-4 w-4 text-muted-foreground" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-sm text-muted-foreground border border-blue-100 rounded-lg">
                          No se encontraron clientes
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Campos del servicio */}
            {selectedCustomer && selectedEquipment && (
              <Card className="border-blue-200 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-[#0A5CB8] mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Detalles del Servicio
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="motivo_ingreso_id" className="text-sm font-medium">
                        Motivo de Ingreso *
                      </Label>
                      {loadingMotivos ? (
                        <div className="p-3 border rounded-md text-center text-muted-foreground">
                          Cargando motivos...
                        </div>
                      ) : (
                        <SimpleSelect
                          options={safeMotivosData}
                          value={motivoIngresoId}
                          onValueChange={handleMotivoChange}
                          placeholder="Seleccione un motivo de ingreso..."
                          emptyMessage="No hay motivos disponibles"
                        />
                      )}
                    </div>

                    {selectedMotivo && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-green-800">
                            Precio del servicio:
                          </span>
                          <span className="text-lg font-bold text-green-800">
                            S/. {selectedMotivo.precio_cobrar}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="descripcion" className="text-sm font-medium">
                        Descripción Motivo Ingreso
                      </Label>
                      <Textarea
                        id="descripcion"
                        value={descripcion_motivo}
                        onChange={(e) => handleDescripcionChange(e.target.value)}
                        placeholder="El cliente ingresa por x motivo"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="observacion" className="text-sm font-medium">
                        Observaciones del Equipo
                      </Label>
                      <Textarea
                        id="observacion"
                        value={observacion}
                        onChange={(e) => handleObservacionChange(e.target.value)}
                        placeholder="Observaciones sobre el estado del equipo, accesorios, etc..."
                      />
                    </div>

                    <Button
                      onClick={handleSubmitService}
                      disabled={isSubmitting || isLoading || !motivoIngresoId}
                      className="w-full bg-[#0A5CB8] hover:bg-[#0A5CB8]/90"
                      size="lg"
                    >
                      {isSubmitting || isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Registrando Servicio...
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5 mr-2" />
                          Registrar Servicio Completo
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedCustomer && (
              <Card className="border-green-200 bg-green-50 shadow-md">
                <CardContent className="p-2 flex justify-between ml-3 items-center">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <User className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-800">
                        {selectedCustomer.nombre} {selectedCustomer.apellidos}
                      </h4>
                      <p className="text-sm font-sans font-medium">
                        {selectedCustomer.numero_documento}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Button variant="secondary" onClick={handleClearSelection}>
                      <X />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Columna derecha */}
          <div className="space-y-6">
            {selectedCustomer ? (
              <>
                <Card className="border-blue-200 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-lg text-[#0750a2] flex items-center gap-2">
                        <Monitor className="h-5 w-5" />
                        Equipos del Cliente
                      </h3>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowAvailableEquipments(true)}
                          className="border-blue-200 text-[#0A5CB8] hover:bg-blue-50"
                        >
                          <Link className="h-4 w-4 mr-1" /> Seleccionar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowEquipmentModal(true)}
                          className="border-blue-200 text-[#0A5CB8] hover:bg-blue-50"
                        >
                          <Plus className="h-4 w-4 mr-1" /> Nuevo
                        </Button>
                      </div>
                    </div>
                    {loadingEquipos ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A5CB8] mx-auto"></div>
                        <p className="text-sm text-muted-foreground mt-2">Cargando equipos...</p>
                      </div>
                    ) : customerEquipments.length > 0 ? (
                      <div className="space-y-3">
                        {customerEquipments.map((equipment) => (
                          <div
                            key={equipment.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${selectedEquipment?.id === equipment.id
                              ? 'bg-[#4e90db] text-white shadow-lg transform scale-105'
                              : 'bg-white border-blue-100 hover:bg-blue-50 hover:border-blue-300'
                              }`}
                            onClick={() => handleSelectEquipment(equipment)}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <p className={`font-semibold text-sm ${selectedEquipment?.id === equipment.id ? 'text-white' : 'text-gray-900'
                                  }`}>
                                  {equipment.brand} {equipment.model}
                                </p>
                                <p className={`text-xs ${selectedEquipment?.id === equipment.id ? 'text-blue-100' : 'text-muted-foreground'
                                  }`}>
                                  {equipment.type} - {equipment.serialNumber}
                                </p>
                                <p className={`text-xs ${selectedEquipment?.id === equipment.id ? 'text-blue-100' : 'text-muted-foreground'
                                  }`}>
                                  Último servicio: {equipment.lastServiceDate}
                                </p>
                              </div>
                              {selectedEquipment?.id === equipment.id && (
                                <div className="bg-white text-[#0A5CB8] rounded-full p-2">
                                  <Monitor className="h-4 w-4" />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 border-2 border-dashed border-blue-200 rounded-lg">
                        <div className="bg-blue-100 p-3 rounded-full inline-block mb-3">
                          <Monitor className="h-8 w-8 text-[#0A5CB8]" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          No hay equipos registrados para este cliente
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowEquipmentModal(true)}
                          className="border-blue-200 text-[#0A5CB8] hover:bg-blue-50"
                        >
                          <Plus className="h-4 w-4 mr-1" /> Registrar Primer Equipo
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {selectedEquipment && (
                  <Card className="bg-gradient-to-r from-[#1e7eeb] to-blue-600 text-white shadow-xl">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Save className="h-5 w-5" />
                        Servicio Listo para Registrar
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-blue-100">Cliente</p>
                          <p className="font-semibold">{selectedCustomer.nombre} {selectedCustomer.apellidos}</p>
                        </div>
                        <div>
                          <p className="text-blue-100">Documento</p>
                          <p className="font-semibold">{selectedCustomer.numero_documento}</p>
                        </div>
                        <div>
                          <p className="text-blue-100">Equipo</p>
                          <p className="font-semibold">{selectedEquipment.brand} {selectedEquipment.model}</p>
                        </div>
                        <div>
                          <p className="text-blue-100">N° Serie</p>
                          <p className="font-semibold">{selectedEquipment.serialNumber}</p>
                        </div>
                      </div>
                      {motivoIngresoId && (
                        <div className="mt-3 p-3 bg-white/20 rounded-lg">
                          <p className="text-blue-100">Motivo seleccionado:</p>
                          <p className="font-semibold">{selectedMotivo?.descripcion}</p>
                          <p className="text-blue-100">Precio: S/. {selectedMotivo?.precio_cobrar}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card className="border-blue-200 shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="bg-blue-100 p-4 rounded-full inline-block ">
                    <User className="h-12 w-12 text-[#1276e8]" />
                  </div>
                  <h3 className="font-semibold text-lg text-[#0552a9] ">Seleccione un cliente</h3>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      {/* Modales */}
      {showAvailableEquipments && (
        <Dialog open={showAvailableEquipments} onOpenChange={setShowAvailableEquipments}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="text-[#0A5CB8]">Seleccionar Equipo Existente</DialogTitle>
              <DialogDescription>
                Elija un equipo de la lista para usarlo con el cliente {selectedCustomer?.nombre}
              </DialogDescription>
            </DialogHeader>
            {loadingAllEquipos ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A5CB8] mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">Cargando equipos...</p>
              </div>
            ) : availableEquipments.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[#0A5CB8]">Tipo</TableHead>
                      <TableHead className="text-[#0A5CB8]">Marca</TableHead>
                      <TableHead className="text-[#0A5CB8]">Modelo</TableHead>
                      <TableHead className="text-[#0A5CB8]">N° Serie</TableHead>
                      <TableHead className="text-[#0A5CB8]">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {availableEquipments.map((equipment) => (
                      <TableRow key={equipment.idServicioEquipos}>
                        <TableCell>{equipment.nombre_equipo || 'N/A'}</TableCell>
                        <TableCell>{equipment.nombre_marca || 'N/A'}</TableCell>
                        <TableCell>{equipment.modelo || 'N/A'}</TableCell>
                        <TableCell>{equipment.serie || 'N/A'}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => handleSelectExistingEquipment(equipment)}
                            className="bg-[#0A5CB8] hover:bg-[#0A5CB8]/90"
                          >
                            Seleccionar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center p-6">
                <p className="text-muted-foreground mb-3">No hay equipos disponibles</p>
                <Button
                  onClick={() => setShowEquipmentModal(true)}
                  className="bg-[#0A5CB8] hover:bg-[#0A5CB8]/90"
                >
                  <Plus className="h-4 w-4 mr-1" /> Crear Nuevo Equipo
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
      {/* Modal para agregar cliente */}
      {showCustomerModal && usuarioId && (
        <CustomerModal
          open={showCustomerModal}
          onOpenChange={setShowCustomerModal}
          onSave={handleCustomerCreated}
          usuarioId={usuarioId}
          isSubmitting={isSubmitting}
        />
      )}
      {/* Modal para agregar equipo */}
      {showEquipmentModal && selectedCustomer && (
        <ServicioEquipoDialog
          open={showEquipmentModal}
          onOpenChange={setShowEquipmentModal}
          onSubmit={handleCreateNewEquipment}
        />
      )}
    </div>
    </div >
  )
}