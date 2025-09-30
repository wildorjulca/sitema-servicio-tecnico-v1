// services/new/ui/hooks/useServiceForm.ts
import { useState, useCallback } from 'react';
import { useEquiposPorCliente, useFiltreClient, useMot_IngHook } from '@/hooks/useService';
import { useServicioEquipoHook } from '@/hooks/useServicioEquipo';
import { CustomerUI, EquipmentUI } from '../types';

export function useServiceForm(usuarioId: string | undefined) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerUI | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentUI | null>(null);

  // Hooks de datos
  const { data: customersRaw, isLoading: loadingCustomers, refetch: refetchClients } = useFiltreClient(searchTerm);
  const { data: equiposRaw, isLoading: loadingEquipos, refetch: refetchEquipos } = useEquiposPorCliente(
    selectedCustomer?.id
  );
  const { data: allEquipos, isLoading: loadingAllEquipos, refetch: refetchAllEquipos } = useServicioEquipoHook(
    usuarioId,
    0,
    100
  );
  const { data: motivosData, isLoading: loadingMotivos, refetch: refetchMotivos } = useMot_IngHook(); // ✅ Agregado refetchMotivos

  // Mapear datos
  const customers: CustomerUI[] = customersRaw?.map((c: any) => ({
    id: c.idCliente,
    nombre: c.nombre,
    apellidos: c.apellidos,
    numero_documento: c.numero_documento,
    tipo_documento: c.tipo_documento,
    direccion: c.direccion,
    telefono: c.telefono,
  })) ?? [];

  const customerEquipments: EquipmentUI[] = (() => {
    try {
      const equiposArray = Array.isArray(equiposRaw) ? equiposRaw : (equiposRaw?.data || []);
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
  })();

  const availableEquipments = allEquipos || allEquipos || [];

  const safeMotivosData = (motivosData || []).map((m: any) => ({
    id: Number(m.idMotivo),
    descripcion: String(m.descripcion || 'Sin descripción'),
    precio_cobrar: Number(m.precio_cobrar) || 0
  }));

  const handleRefetchEquipos = useCallback(() => {
    if (selectedCustomer?.id) {
      refetchEquipos();
    }
  }, [selectedCustomer?.id, refetchEquipos]);

  return {
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
    refetchMotivos, // ✅ Agregado aquí
    handleRefetchEquipos
  };
}