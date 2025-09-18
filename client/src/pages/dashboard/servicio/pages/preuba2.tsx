'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {  X } from 'lucide-react'


interface ServiceFormProps {
  selectedCustomer: any
  selectedEquipment: any
  onClose: () => void
  onSave: (serviceData: any) => void
}

// Datos de ejemplo para los selects
const motivoIngresoOptions = [
  { id: 1, nombre: 'Reparación' },
  { id: 2, nombre: 'Mantenimiento' },
  { id: 3, nombre: 'Revisión' },
  { id: 4, nombre: 'Garantía' },
  { id: 5, nombre: 'Instalación' }
]

export default function ServiceForm({ selectedCustomer, selectedEquipment, onClose, onSave }: ServiceFormProps) {
  const [formData, setFormData] = useState({
    motivo_ingreso_id: '',
    descripcion_motivo: '',
    observacion: '',
    diagnostico: '',
    solucion: '',
    precio: '0',
    precioRepuestos: '0',
    estado_id: '1', // Estado por defecto: Recibido
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Generar código de seguimiento aleatorio (7 caracteres)
    const codigoSeguimiento = Math.random().toString(36).substring(2, 9).toUpperCase()
    
    const serviceData = {
      ...formData,
      codigoSeguimiento,
      cliente_id: selectedCustomer.id,
      servicio_equipos_id: selectedEquipment.id,
      // Estos campos normalmente vendrían de la autenticación
      usuario_recibe_id: 1, // ID del usuario logueado
      precioTotal: (parseFloat(formData.precio) + parseFloat(formData.precioRepuestos)).toString()
    }
    
    onSave(serviceData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Nuevo Servicio Técnico</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Información del cliente */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información del Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{selectedCustomer.name} {selectedCustomer.lastName}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedCustomer.documentType}: {selectedCustomer.documentNumber}
                </p>
                <p className="text-sm mt-2">{selectedCustomer.address}</p>
                <p className="text-sm">{selectedCustomer.phone}</p>
              </CardContent>
            </Card>
            
            {/* Información del equipo */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información del Equipo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{selectedEquipment.brand} {selectedEquipment.model}</p>
                <p className="text-sm text-muted-foreground">{selectedEquipment.type}</p>
                <p className="text-sm mt-2">N° Serie: {selectedEquipment.serialNumber}</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna izquierda - Información del servicio */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">

                <div className="space-y-2">
                  <Label htmlFor="motivo_ingreso_id">Motivo de Ingreso</Label>
                  <Select
                    value={formData.motivo_ingreso_id}
                    onValueChange={(value) => handleSelectChange('motivo_ingreso_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un motivo" />
                    </SelectTrigger>
                    <SelectContent>
                      {motivoIngresoOptions.map(option => (
                        <SelectItem key={option.id} value={option.id.toString()}>
                          {option.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              

              
              <div className="space-y-2">
                <Label htmlFor="observacion">Observaciones</Label>
                <Textarea
                  id="observacion"
                  name="observacion"
                  value={formData.observacion}
                  onChange={handleInputChange}
                  placeholder="Observaciones adicionales..."
                  rows={3}
                />
              </div>
            </div>
            
            {/* Columna derecha - Diagnóstico y precios */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="diagnostico">Diagnóstico</Label>
                <Textarea
                  id="diagnostico"
                  name="diagnostico"
                  value={formData.diagnostico}
                  onChange={handleInputChange}
                  placeholder="Diagnóstico del equipo..."
                  rows={3}
                />
              </div>
              

              

              
              <div className="bg-muted p-3 rounded-md">
                <div className="flex justify-between font-medium">
                  <span>Total a pagar:</span>
                  <span>S/ {(parseFloat(formData.precio) + parseFloat(formData.precioRepuestos)).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Guardar Servicio
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}