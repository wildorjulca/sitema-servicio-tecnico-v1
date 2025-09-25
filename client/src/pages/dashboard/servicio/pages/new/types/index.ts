export interface CustomerAPI {
  idCliente: number
  nombre: string
  apellidos: string
  numero_documento: string
  tipo_documento: string
  direccion: string
  telefono: string
}

export interface CustomerUI {
  id: number
  nombre: string
  apellidos: string
  numero_documento: string
  tipo_documento: string
  direccion: string
  telefono: string
}

export interface EquipmentUI {
  id: number
  customerId: number
  type: string
  brand: string
  model: string
  serialNumber: string
  lastServiceDate: string
  servicio_equipos_id: number
}

export interface ServicioEquipo {
  idServicioEquipos: number
  EQUIPO_idEquipo: number
  nombre_equipo: string
  nombre_marca: string
  modelo: string
  serie: string
}