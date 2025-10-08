// services/new/New_Service.tsx
'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { User } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { useAddClienteHook } from '@/hooks/useCliente'
import { useAddServicioEqHook } from '@/hooks/useServicioEquipo'
import { useService } from '@/context/ServiceContext'
import toast from 'react-hot-toast'
import { ServicioEquipoDialog } from '@/pages/dashboard/servicio_equipos/ui/modal'
import { useServiceForm } from './ui/useServiceForm'
import { CustomerUI, EquipmentUI } from './types'
import { StatusBar } from './ui/StatusBar'
import { CustomerSearchSection } from './ui/CustomerSearchSection'
import { ServiceDetailsSection } from './ui/ServiceDetailsSection'
import { CustomerCard } from './ui/CustomerCard'
import { EquipmentSelectionSection } from './ui/EquipmentSelectionSection'
import { AvailableEquipmentsModal } from './ui/AvailableEquipmentsModal'
import CustomerModal from '@/pages/dashboard/cliente/ui/CustomerModal '
import { useNavigate } from 'react-router-dom'
import { ClienteEdit, Equipment, MotivoIngreso, ServicioEquipo } from '@/interface'
import { AxiosError } from 'axios'
import { getErrorMessage } from '@/lib/getErrorMessage'

export default function New_Service() {
  const { user } = useUser()
  const usuarioId = user?.id
  const { serviceData, updateServiceData, submitService, isLoading, setPasoActual } = useService()

  const navigate = useNavigate()

  // Estados del formulario
  const [motivoIngresoId, setMotivoIngresoId] = useState<string>('')
  const [observacion, setObservacion] = useState('')
  const [descripcion_motivo, setDescripcion_motivo] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [showEquipmentModal, setShowEquipmentModal] = useState(false)
  const [showAvailableEquipments, setShowAvailableEquipments] = useState(false)

  // Estado para refrescar motivos
  const [refreshMotivosKey, setRefreshMotivosKey] = useState(0)

  // Hooks personalizados
  const {
    searchTerm,
    setSearchTerm,
    selectedCustomer,
    setSelectedCustomer,
    selectedEquipment,
    setSelectedEquipment,
    customers,
    customerEquipments,
    availableEquipments,
    safeMotivosData,
    loadingCustomers,
    loadingEquipos,
    loadingAllEquipos,
    loadingMotivos,
    refetchClients,
    refetchAllEquipos,
    handleRefetchEquipos,
    refetchMotivos
  } = useServiceForm(usuarioId)

  // Handler para cuando se agrega un nuevo motivo
  const handleMotivoAdded = () => {
    // Refrescar la lista de motivos
    refetchMotivos?.();
    setRefreshMotivosKey(prev => prev + 1);
    toast.success("Nuevo motivo agregado, lista actualizada");
  };

  // Hooks de mutación
  const addCliente = useAddClienteHook(usuarioId!)
  const addServicioEq = useAddServicioEqHook(usuarioId!)

  // Sincronización con contexto
  useEffect(() => {
    if (serviceData.cliente_id && !selectedCustomer) {
      const clienteEncontrado = customers.find(c => c.id === serviceData.cliente_id)
      if (clienteEncontrado) {
        setSelectedCustomer(clienteEncontrado)
      }
    }
  }, [serviceData.cliente_id, selectedCustomer, customers])

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



  // Handlers
  const handleSelectCustomer = (customer: CustomerUI) => {
    setSelectedCustomer(customer)
    setSelectedEquipment(null)

    updateServiceData({
      cliente_id: customer.id,
      servicio_equipos_id: null,
      motivo_ingreso_id: null,
      descripcion_motivo: '',
      observacion: ''
    })

    setMotivoIngresoId('')
    setObservacion('')
    setDescripcion_motivo('')

    handleRefetchEquipos()
    setPasoActual(2)
  }

  const handleSelectEquipment = (equipment: EquipmentUI) => {
    setSelectedEquipment(equipment)
    updateServiceData({ servicio_equipos_id: equipment.servicio_equipos_id })
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

  const handleMotivoChange = (value: string) => {
    setMotivoIngresoId(value)
    updateServiceData({ motivo_ingreso_id: value ? parseInt(value) : null })
  }

  const handleObservacionChange = (value: string) => {
    setObservacion(value)
    updateServiceData({ observacion: value })
  }

  const handleDescripcionChange = (value: string) => {
    setDescripcion_motivo(value)
    updateServiceData({ descripcion_motivo: value })
  }

  const handleCustomerCreated = async (payload: ClienteEdit) => {
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
    } catch (error: unknown) {
      let errorMessage = "Error desconocido";

      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.error || error.response?.data?.mensaje || errorMessage;
      }

      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSelectExistingEquipment = (equipment: Equipment) => {
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

  const handleCreateNewEquipment = async (equipmentData: ServicioEquipo) => {
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
    } catch (error: unknown) {
      toast.error(`Error: ${getErrorMessage(error)}`);
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (window.confirm('¿Estás seguro de que quieres cancelar? Los datos no guardados se perderán.')) {
      navigate('/dashboard/list')
    }
  }


  // En New_Service.tsx - busca handleSubmitService y cámbialo por:

  const handleSubmitService = async (precioFinal?: number) => {
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
      // Usar el precio final si viene, sino usar el precio del motivo
      const precioARegistrar = precioFinal !== undefined ? precioFinal : selectedMotivo?.precio_cobrar || 0;

      console.log('💰 Precio a registrar en frontend:', precioARegistrar);
      console.log('📝 Precio recibido como parámetro:', precioFinal);
      console.log('🎯 Precio del motivo:', selectedMotivo?.precio_cobrar);

      // Actualizar el contexto (opcional)
      updateServiceData({
        motivo_ingreso_id: parseInt(motivoIngresoId),
        descripcion_motivo: descripcion_motivo,
        observacion: observacion,
        precio_final: precioARegistrar
      })

      // ✅✅✅ ESTA ES LA LÍNEA CLAVE - PASAR EL PARÁMETRO ✅✅✅
      const result = await submitService(precioARegistrar);

      if (result.success) {
        toast.success(`Servicio registrado exitosamente! Precio: S/. ${precioARegistrar}`)

        setTimeout(() => {
          navigate('/dashboard/list')
        }, 1000)
      } else {
        toast.error(`Error: ${result.error}`)
      }
    } catch (error: unknown) {
      toast.error(`Error: ${getErrorMessage(error)}`);
      console.log('💥 Error en handleSubmitService:', error);
    } finally {
      setIsSubmitting(false)
    }
  }
  // En New_Service.tsx - Agrega esta función
  const handleClearCustomer = () => {
    setSelectedCustomer(null);
    setSearchTerm('');
    setSelectedEquipment(null);
    setMotivoIngresoId('');
    setObservacion('');
    setDescripcion_motivo('');

    updateServiceData({
      cliente_id: null,
      servicio_equipos_id: null,
      motivo_ingreso_id: null,
      descripcion_motivo: '',
      observacion: ''
    });

    setPasoActual(1);
  };
  // Variables para la barra de estado
  const clienteCompleto = !!serviceData.cliente_id
  const equipoCompleto = !!serviceData.servicio_equipos_id
  const motivoCompleto = !!serviceData.motivo_ingreso_id
  const selectedMotivo = safeMotivosData.find(m => m.id === parseInt(motivoIngresoId))

  if (!usuarioId) return <div>Por favor inicia sesión para crear servicios</div>

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4 ">
          <span className="text-2xl font-semibold text-gray-700 mb-2 font-mono">
            Registro de Los Equipos
          </span>
        </div>

        <StatusBar
          clienteCompleto={clienteCompleto}
          equipoCompleto={equipoCompleto}
          motivoCompleto={motivoCompleto}
          isSubmitting={isSubmitting}
          isLoading={isLoading}
          onSubmit={handleSubmitService}
          onCancel={handleCancel}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Columna izquierda */}
          <div className="space-y-6">
            <CustomerSearchSection
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
              customers={customers}
              loadingCustomers={loadingCustomers}
              onSearch={() => refetchClients()}
              onSelectCustomer={handleSelectCustomer}
              onOpenCustomerModal={() => setShowCustomerModal(true)}
              selectedCustomer={selectedCustomer}
              onClearCustomer={handleClearCustomer}
            />

            {selectedCustomer && selectedEquipment && (
              <ServiceDetailsSection
                key={refreshMotivosKey}
                motivoIngresoId={motivoIngresoId}
                observacion={observacion}
                descripcion_motivo={descripcion_motivo}
                selectedMotivo={selectedMotivo}
                safeMotivosData={safeMotivosData}
                loadingMotivos={loadingMotivos}
                isSubmitting={isSubmitting}
                isLoading={isLoading}
                onMotivoChange={handleMotivoChange}
                onObservacionChange={handleObservacionChange}
                onDescripcionChange={handleDescripcionChange}
                onSubmit={handleSubmitService}
                onMotivoAdded={handleMotivoAdded}
                usuarioId={usuarioId}
              />
            )}

            {selectedCustomer && (
              <CustomerCard
                customer={selectedCustomer}
                onClearSelection={handleClearSelection}
              />
            )}
          </div>

          {/* Columna derecha */}
          <div className="space-y-6">
            {selectedCustomer ? (
              <>
                <EquipmentSelectionSection
                  selectedCustomer={selectedCustomer}
                  customerEquipments={customerEquipments}
                  selectedEquipment={selectedEquipment}
                  loadingEquipos={loadingEquipos}
                  onSelectEquipment={handleSelectEquipment}
                  onOpenAvailableEquipments={() => setShowAvailableEquipments(true)}
                  onOpenEquipmentModal={() => setShowEquipmentModal(true)}
                />

                {selectedEquipment && (
                  <ServiceSummaryCard
                    customer={selectedCustomer}
                    equipment={selectedEquipment}
                    motivo={selectedMotivo}
                  />
                )}
              </>
            ) : (
              <EmptyCustomerState />
            )}
          </div>
        </div>

        {/* Modales */}
        <AvailableEquipmentsModal
          open={showAvailableEquipments}
          onOpenChange={setShowAvailableEquipments}
          availableEquipments={availableEquipments}
          loadingAllEquipos={loadingAllEquipos}
          selectedCustomer={selectedCustomer}
          onSelectEquipment={handleSelectExistingEquipment}
          onOpenEquipmentModal={() => setShowEquipmentModal(true)}
        />

        {showCustomerModal && usuarioId && (
          <CustomerModal
            open={showCustomerModal}
            onOpenChange={setShowCustomerModal}
            onSave={handleCustomerCreated}
            usuarioId={usuarioId}
            isSubmitting={isSubmitting}
          />
        )}

        {showEquipmentModal && selectedCustomer && (
          <ServicioEquipoDialog
            open={showEquipmentModal}
            onOpenChange={setShowEquipmentModal}
            onSubmit={handleCreateNewEquipment}
          />
        )}
      </div>
    </div>
  );
}

// Componentes auxiliares locales
function ServiceSummaryCard({ customer, equipment, motivo }: {
  customer: CustomerUI;
  equipment: EquipmentUI;
  motivo: MotivoIngreso;
}) {
  return (
    <Card className="bg-gradient-to-r from-[#1e7eeb] to-blue-600 text-white shadow-xl">
      <CardContent className="p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          Servicio Listo para Registrar
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-blue-100">Cliente</p>
            <p className="font-semibold">{customer.nombre} {customer.apellidos}</p>
          </div>
          <div>
            <p className="text-blue-100">Documento</p>
            <p className="font-semibold">{customer.numero_documento}</p>
          </div>
          <div>
            <p className="text-blue-100">Equipo</p>
            <p className="font-semibold">{equipment.brand} {equipment.model}</p>
          </div>
          <div>
            <p className="text-blue-100">N° Serie</p>
            <p className="font-semibold">{equipment.serialNumber}</p>
          </div>
        </div>
        {motivo && (
          <div className="mt-3 p-3 bg-white/20 rounded-lg">
            <p className="text-blue-100">Motivo seleccionado:</p>
            <p className="font-semibold">{motivo.descripcion}</p>
            <p className="text-blue-100">Precio: S/. {motivo.precio_cobrar}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyCustomerState() {
  return (
    <Card className="border-blue-200 shadow-lg">
      <CardContent className="p-6 text-center">
        <div className="bg-blue-100 p-4 rounded-full inline-block ">
          <User className="h-8 w-8 text-[#1276e8]" />
        </div>
        <h3 className="font-semibold text-lg text-[#5f646a] ">Seleccione un cliente para ver si tiene equipos </h3>
      </CardContent>
    </Card>
  );
}