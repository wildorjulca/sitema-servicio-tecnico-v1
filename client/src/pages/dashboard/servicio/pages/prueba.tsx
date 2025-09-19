// components/customer-search.tsx
'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Search, User, Monitor, ChevronUp, X, Plus, Link, Save } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ServiceForm from './preuba2'
import { useEquiposPorCliente, useFiltreClient } from '@/hooks/useService'
import { useAddServicioEqHook, useServicioEquipoHook } from '@/hooks/useServicioEquipo'
import { useUser } from '@/hooks/useUser'
import { useAddClienteHook } from '@/hooks/useCliente'
import toast from 'react-hot-toast'
import { ServicioEquipo } from '@/interface'
import { useService } from '@/context/ServiceContext'
import CustomerModal from '../../cliente/ui/CustomerModal '
import { ServicioEquipoDialog } from '../../servicio_equipos/ui/modal'

interface CustomerAPI {
  idCliente: number
  nombre: string
  apellidos: string
  numero_documento: string
  tipo_documento: string
  direccion: string
  telefono: string
}

interface CustomerUI {
  id: number
  nombre: string
  apellidos: string
  numero_documento: string
  tipo_documento: string
  direccion: string
  telefono: string
}

interface EquipmentUI {
  id: number
  customerId: number
  type: string
  brand: string
  model: string
  serialNumber: string
  lastServiceDate: string
  servicio_equipos_id: number
}

export default function CustomerSearch() {
  const { user } = useUser()
  const usuarioId = user?.id
  const { serviceData, setCliente, setEquipo, setServicio, submitService } = useService()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerUI | null>(null)
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentUI | null>(null)
  const [showServiceForm, setShowServiceForm] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [showEquipmentModal, setShowEquipmentModal] = useState(false)
  const [showAvailableEquipments, setShowAvailableEquipments] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Hook para agregar cliente
  const addCliente = useAddClienteHook(usuarioId!)
  // Hook para crear servicio-equipo
  const addServicioEq = useAddServicioEqHook(usuarioId!)

  // Hook clientes
  const { data: customersRaw, isLoading: loadingCustomers, refetch: refetchClients } = useFiltreClient(searchTerm)

  // Hook equipos del cliente
  const { data: equiposRaw, isLoading: loadingEquipos, refetch: refetchEquipos } = useEquiposPorCliente(selectedCustomer?.id)

  // Hook para todos los equipos disponibles (sin filtro de marca)
  const { data: allEquipos, isLoading: loadingAllEquipos, refetch: refetchAllEquipos } = useServicioEquipoHook(
    usuarioId,
    0, // pageIndex
    100 // pageSize (número grande para traer todos)
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

  // Mapear equipos del cliente API → UI
  const customerEquipments: EquipmentUI[] = equiposRaw?.data?.map((eq: any) => ({
    id: eq.EQUIPO_idEquipo,
    customerId: selectedCustomer?.id ?? 0,
    type: eq.nombre_equipo,
    brand: eq.nombre_marca,
    model: eq.modelo,
    serialNumber: eq.serie,
    lastServiceDate: eq.ultimo_servicio
      ? new Date(eq.ultimo_servicio).toLocaleDateString()
      : 'N/A',
    servicio_equipos_id: eq.idServicioEquipos
  })) ?? []

  // Mapear equipos disponibles
  const availableEquipments: ServicioEquipo[] = allEquipos || []

  // Sincronizar con el contexto
  useEffect(() => {
    if (serviceData.cliente) {
      setSelectedCustomer({
        id: serviceData.cliente.id!,
        nombre: serviceData.cliente.nombre,
        apellidos: serviceData.cliente.apellidos,
        numero_documento: serviceData.cliente.documento,
        tipo_documento: '',
        direccion: '',
        telefono: ''
      })
    }
  }, [serviceData.cliente])

  const handleSearch = () => setIsSearching(true)

  const handleSelectCustomer = (customer: CustomerUI) => {
    setSelectedCustomer(customer)
    setIsSearching(false)
    setSelectedEquipment(null)

    // Guardar en contexto
    setCliente({
      id: customer.id,
      nombre: customer.nombre,
      apellidos: customer.apellidos,
      documento: customer.numero_documento
    })

    // Refrescar equipos del cliente
    refetchEquipos()
  }

  const handleSelectEquipment = (equipment: EquipmentUI) => {
    setSelectedEquipment(equipment)

    // Guardar en contexto
    setEquipo({
      id: equipment.id,
      tipo: equipment.type,
      marca: equipment.brand,
      modelo: equipment.model,
      serie: equipment.serialNumber,
      servicio_equipos_id: equipment.servicio_equipos_id
    })
  }

  const handleClearSelection = () => {
    setSelectedCustomer(null)
    setSelectedEquipment(null)
    setSearchTerm('')
    setCliente(null)
    setEquipo(null)
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

      // Convertir el nuevo cliente al formato UI
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

      // Guardar en contexto
      setCliente({
        id: uiCustomer.id,
        nombre: uiCustomer.nombre,
        apellidos: uiCustomer.apellidos,
        documento: uiCustomer.numero_documento
      })

      refetchClients()
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.mensaje || "Error desconocido"
      toast.error(`Error: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSelectExistingEquipment = (equipment: ServicioEquipo) => {
    // Cuando seleccionas un equipo existente de la lista general
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

    // Guardar en contexto
    setEquipo({
      id: uiEquipment.id,
      tipo: uiEquipment.type,
      marca: uiEquipment.brand,
      modelo: uiEquipment.model,
      serie: uiEquipment.serialNumber,
      servicio_equipos_id: uiEquipment.servicio_equipos_id
    })

    setShowAvailableEquipments(false)
    toast.success("Equipo seleccionado")
  }

  const handleCreateNewEquipment = async (equipmentData: any) => {
    if (!selectedCustomer || !usuarioId) {
      toast.error("Seleccione un cliente primero")
      return
    }

    setIsSubmitting(true)
    try {
      // Crear el nuevo servicio-equipo
      const newEquipment = await addServicioEq.mutateAsync(equipmentData)

      // Crear el objeto UI para el equipo
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

      // Guardar en contexto
      setEquipo({
        id: uiEquipment.id,
        tipo: uiEquipment.type,
        marca: uiEquipment.brand,
        modelo: uiEquipment.model,
        serie: uiEquipment.serialNumber,
        servicio_equipos_id: uiEquipment.servicio_equipos_id
      })

      toast.success("Equipo creado y seleccionado")
      setShowEquipmentModal(false)
      refetchAllEquipos() // Refrescar la lista de equipos disponibles
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.mensaje || "Error desconocido"
      toast.error(`Error: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFinalSubmit = async (serviceFormData: any) => {
    // Verificar que tenemos el servicio_equipos_id
    if (!serviceData.equipo?.servicio_equipos_id) {
      toast.error("Falta seleccionar un equipo")
      return
    }

    setIsSubmitting(true)

    // Actualizar los datos del servicio con los del formulario
    setServicio(serviceFormData)

    // Esperar un momento para que se actualice el contexto
    setTimeout(async () => {
      const result = await submitService()

      if (result.success) {
        toast.success('Servicio registrado exitosamente!')
        setShowServiceForm(false)
      } else {
        toast.error(`Error: ${result.error}`)
      }
      setIsSubmitting(false)
    }, 100)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gestión de Servicios Técnicos</h1>

      {/* Barra de estado del servicio */}
      <div className="mb-6 p-4 bg-muted/50 rounded-lg">
        <h3 className="font-medium mb-2">Estado del Servicio</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className={`flex items-center gap-1 ${serviceData.cliente ? 'text-green-600' : 'text-muted-foreground'}`}>
            <User className="h-4 w-4" />
            <span>Cliente: {serviceData.cliente ? 'Seleccionado' : 'Pendiente'}</span>
          </div>
          <div className={`flex items-center gap-1 ${serviceData.equipo ? 'text-green-600' : 'text-muted-foreground'}`}>
            <Monitor className="h-4 w-4" />
            <span>Equipo: {serviceData.equipo ? 'Seleccionado' : 'Pendiente'}</span>
          </div>
          {serviceData.cliente && serviceData.equipo && (
            <Button size="sm" onClick={() => setShowServiceForm(true)}>
              <Save className="h-4 w-4 mr-1" /> Completar Servicio
            </Button>
          )}
        </div>
      </div>

      {/* Layout de 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Columna izquierda - Búsqueda y selección de cliente */}
        <div className="space-y-6">
          {/* Búsqueda de clientes */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-4">Buscar Cliente</h3>
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
                <Button onClick={handleSearch} disabled={!searchTerm} size="sm">
                  {loadingCustomers ? "Buscando..." : "Buscar"}
                </Button>
              </div>

              <Button 
                variant="outline" 
                onClick={() => setShowCustomerModal(true)} 
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-1" /> Nuevo Cliente
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
                      <div className="max-h-60 overflow-y-auto border rounded-lg">
                        {customers.map((customer) => (
                          <div
                            key={customer.id}
                            className="p-3 border-b hover:bg-muted/50 cursor-pointer transition-colors"
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
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No se encontraron clientes
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Cliente seleccionado */}
          {selectedCustomer && (
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium">Cliente Seleccionado</h3>
                  <Button variant="outline" size="sm" onClick={handleClearSelection}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">
                      {selectedCustomer.nombre} {selectedCustomer.apellidos}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedCustomer.numero_documento}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedCustomer.telefono}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Columna derecha - Gestión de equipos */}
        <div className="space-y-6">
          {selectedCustomer ? (
            <>
              {/* Equipos del cliente */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Equipos del Cliente</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setShowAvailableEquipments(true)}>
                        <Link className="h-4 w-4 mr-1" /> Seleccionar
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setShowEquipmentModal(true)}>
                        <Plus className="h-4 w-4 mr-1" /> Nuevo
                      </Button>
                    </div>
                  </div>

                  {loadingEquipos ? (
                    <p className="text-sm text-muted-foreground">Cargando equipos...</p>
                  ) : customerEquipments.length > 0 ? (
                    <div className="space-y-2">
                      {customerEquipments.map((equipment) => (
                        <div
                          key={equipment.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedEquipment?.id === equipment.id 
                              ? 'bg-primary/10 border-primary' 
                              : 'hover:bg-muted/50'
                          }`}
                          onClick={() => handleSelectEquipment(equipment)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-sm">{equipment.brand} {equipment.model}</p>
                              <p className="text-xs text-muted-foreground">
                                {equipment.type} - {equipment.serialNumber}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Último servicio: {equipment.lastServiceDate}
                              </p>
                            </div>
                            {selectedEquipment?.id === equipment.id && (
                              <div className="bg-primary text-primary-foreground rounded-full p-1">
                                <Monitor className="h-3 w-3" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <div className="bg-muted/20 p-3 rounded-full inline-block mb-3">
                        <Monitor className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        No hay equipos registrados
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Resumen de selección */}
              {selectedEquipment && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-3">Resumen de Selección</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Cliente</p>
                        <p className="font-medium">{selectedCustomer.nombre} {selectedCustomer.apellidos}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Documento</p>
                        <p className="font-medium">{selectedCustomer.numero_documento}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Equipo</p>
                        <p className="font-medium">{selectedEquipment.brand} {selectedEquipment.model}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Serie</p>
                        <p className="font-medium">{selectedEquipment.serialNumber}</p>
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-4" 
                      onClick={() => setShowServiceForm(true)}
                      size="sm"
                    >
                      <Save className="h-4 w-4 mr-1" /> Continuar con el Servicio
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-muted/20 p-4 rounded-full inline-block mb-4">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-lg mb-2">Seleccione un cliente</h3>
                <p className="text-muted-foreground">
                  Busque o registre un cliente para comenzar con el servicio técnico
                </p>
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
              <DialogTitle>Seleccionar Equipo Existente</DialogTitle>
              <DialogDescription>
                Elija un equipo de la lista para usarlo con el cliente {selectedCustomer?.nombre}
              </DialogDescription>
            </DialogHeader>

            {loadingAllEquipos ? (
              <p>Cargando equipos...</p>
            ) : availableEquipments.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Marca</TableHead>
                      <TableHead>Modelo</TableHead>
                      <TableHead>N° Serie</TableHead>
                      <TableHead>Acción</TableHead>
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
              <div className="text-center p-4">
                <p>No hay equipos disponibles</p>
                <Button 
                  className="mt-2"
                  onClick={() => setShowEquipmentModal(true)}
                >
                  <Plus className="h-4 w-4 mr-1" /> Crear Nuevo Equipo
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* Formulario de servicio */}
      {showServiceForm && (
        <ServiceForm
          selectedCustomer={selectedCustomer}
          selectedEquipment={selectedEquipment}
          onClose={() => setShowServiceForm(false)}
          onSave={handleFinalSubmit}
          serviceData={serviceData}
          updateServiceData={setServicio}
          isSubmitting={isSubmitting}
        />
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
  )
}