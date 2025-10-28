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
import { ClienteEdit, Equipment, ServicioEquipo } from '@/interface'
import { AxiosError } from 'axios'
import { getErrorMessage } from '@/lib/getErrorMessage'

// NUEVA INTERFACE para los motivos seleccionados
interface MotivoSeleccionado {
  motivo_ingreso_id: number;
  precio_motivo: number;
  motivo_nombre?: string;
}

export default function New_Service() {
  const { user } = useUser()
  const usuarioId = user?.id
  const { serviceData, updateServiceData, submitService, isLoading, setPasoActual } = useService()

  const navigate = useNavigate()

  // Estados del formulario - CAMBIO: Ahora manejamos array de motivos
  const [motivosSeleccionados, setMotivosSeleccionados] = useState<MotivoSeleccionado[]>([]);
  const [observacion, setObservacion] = useState('')
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
    if (serviceData.observacion !== undefined) {
      setObservacion(serviceData.observacion)
    }
  }, [serviceData.observacion])

  // Handlers
  const handleSelectCustomer = (customer: CustomerUI) => {
    setSelectedCustomer(customer)
    setSelectedEquipment(null)
    setMotivosSeleccionados([]); // Limpiar motivos al cambiar cliente

    updateServiceData({
      cliente_id: customer.id,
      servicio_equipos_id: null,
      observacion: ''
    })

    setObservacion('')
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
    setMotivosSeleccionados([])
    setObservacion('')

    updateServiceData({
      cliente_id: null,
      servicio_equipos_id: null,
      observacion: ''
    })

    setPasoActual(1)
  }

  // NUEVOS HANDLERS para manejar múltiples motivos
  const handleMotivoAdd = (motivo: MotivoSeleccionado) => {
    setMotivosSeleccionados(prev => [...prev, motivo]);
    toast.success("Motivo agregado");
  };

  const handleMotivoRemove = (index: number) => {
    setMotivosSeleccionados(prev => prev.filter((_, i) => i !== index));
    toast.success("Motivo eliminado");
  };

  const handleMotivoUpdate = (index: number, motivoActualizado: MotivoSeleccionado) => {
    setMotivosSeleccionados(prev => 
      prev.map((m, i) => i === index ? motivoActualizado : m)
    );
  };

  const handleObservacionChange = (value: string) => {
    setObservacion(value)
    updateServiceData({ observacion: value })
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

  // CAMBIO: Ahora manejamos múltiples motivos
  const handleSubmitService = async (precioTotal?: number) => {
    if (!serviceData.servicio_equipos_id) {
      toast.error("Falta seleccionar un equipo")
      return
    }
    if (motivosSeleccionados.length === 0) {
      toast.error("Debe agregar al menos un motivo de ingreso")
      return
    }

    setIsSubmitting(true)
    try {
      // Calcular precio total si no viene (suma de todos los motivos)
      const precioARegistrar = precioTotal !== undefined ? precioTotal : 
        motivosSeleccionados.reduce((total, motivo) => total + motivo.precio_motivo, 0);

      console.log('💰 Precio total a registrar:', precioARegistrar);
      console.log('🔧 Motivos a registrar:', motivosSeleccionados);

      // Actualizar el contexto
      updateServiceData({
        observacion: observacion,
        precio_final: precioARegistrar
      })

      // Enviar el servicio con múltiples motivos
      const result = await submitService(precioARegistrar, motivosSeleccionados);

      if (result.success) {
        toast.success(`Servicio registrado exitosamente con ${motivosSeleccionados.length} motivo(s)! Precio: S/. ${precioARegistrar}`)

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

  const handleClearCustomer = () => {
    setSelectedCustomer(null);
    setSearchTerm('');
    setSelectedEquipment(null);
    setMotivosSeleccionados([]);
    setObservacion('');

    updateServiceData({
      cliente_id: null,
      servicio_equipos_id: null,
      observacion: ''
    });

    setPasoActual(1);
  };

  // Variables para la barra de estado - CAMBIO: ahora verificamos si hay motivos
  const clienteCompleto = !!serviceData.cliente_id
  const equipoCompleto = !!serviceData.servicio_equipos_id
  const motivoCompleto = motivosSeleccionados.length > 0  // CAMBIO: Verificar array no vacío

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
                motivosSeleccionados={motivosSeleccionados}  // CAMBIO: Pasar array de motivos
                observacion={observacion}
                safeMotivosData={safeMotivosData}
                loadingMotivos={loadingMotivos}
                isSubmitting={isSubmitting}
                isLoading={isLoading}
                onMotivoAdd={handleMotivoAdd}  // NUEVO: Handlers para múltiples motivos
                onMotivoRemove={handleMotivoRemove}
                onMotivoUpdate={handleMotivoUpdate}
                onObservacionChange={handleObservacionChange}
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
                    motivos={motivosSeleccionados}  // CAMBIO: Pasar array de motivos
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

// Componentes auxiliares locales - CAMBIO: Ahora recibe array de motivos
function ServiceSummaryCard({ customer, equipment, motivos }: {
  customer: CustomerUI;
  equipment: EquipmentUI;
  motivos: MotivoSeleccionado[];
}) {
  const precioTotal = motivos.reduce((total, motivo) => total + motivo.precio_motivo, 0);

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
        {motivos.length > 0 && (
          <div className="mt-3 p-3 bg-white/20 rounded-lg">
            <p className="text-blue-100">Motivos seleccionados ({motivos.length}):</p>
            {motivos.map((motivo, index) => (
              <div key={index} className="mt-1">
                <p className="font-semibold text-sm">{motivo.motivo_nombre}</p>
                <p className="text-blue-100 text-xs">Precio: S/. {motivo.precio_motivo}</p>
              </div>
            ))}
            <div className="mt-2 pt-2 border-t border-white/30">
              <p className="font-semibold">Precio Total: S/. {precioTotal}</p>
            </div>
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