// components/customer-search.tsx
'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, User, Monitor, ChevronUp, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ServiceForm from './preuba2'

interface Customer {
  id: number
  name: string
  lastName: string
  documentType: string
  documentNumber: string
  address: string
  phone: string
}

interface Equipment {
  id: number
  customerId: number
  type: string
  brand: string
  model: string
  serialNumber: string
  lastServiceDate: string
  status: 'active' | 'inactive' | 'in-service'
}

export default function CustomerSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [equipments, setEquipments] = useState<Equipment[]>([])
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [showServiceForm, setShowServiceForm] = useState(false) // Nuevo estado

  // Simular datos de ejemplo
  useEffect(() => {
    const mockCustomers: Customer[] = [
      {
        id: 1,
        name: 'Juan',
        lastName: 'Pérez García',
        documentType: 'DNI',
        documentNumber: '12345678',
        address: 'Av. Principal 123',
        phone: '987654321'
      },
      {
        id: 2,
        name: 'María',
        lastName: 'López Martínez',
        documentType: 'DNI',
        documentNumber: '87654321',
        address: 'Calle Secundaria 456',
        phone: '912345678'
      },
      {
        id: 3,
        name: 'Carlos',
        lastName: 'González Rodríguez',
        documentType: 'RUC',
        documentNumber: '10234567890',
        address: 'Jr. Comercial 789',
        phone: '934567890'
      }
    ]

    const mockEquipments: Equipment[] = [
      {
        id: 1,
        customerId: 1,
        type: 'Laptop',
        brand: 'HP',
        model: 'Pavilion 15',
        serialNumber: 'HP123456',
        lastServiceDate: '2023-10-15',
        status: 'active'
      },
      {
        id: 2,
        customerId: 1,
        type: 'Impresora',
        brand: 'Epson',
        model: 'L380',
        serialNumber: 'EPS789012',
        lastServiceDate: '2023-09-20',
        status: 'in-service'
      },
      {
        id: 3,
        customerId: 2,
        type: 'Monitor',
        brand: 'Dell',
        model: 'S2421HN',
        serialNumber: 'DEL345678',
        lastServiceDate: '2023-11-05',
        status: 'active'
      }
    ]

    setCustomers(mockCustomers)
    setEquipments(mockEquipments)
  }, [])

  const handleSearch = () => {
    setIsSearching(true)
  }

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsSearching(false)
  }

  const handleSelectEquipment = (equipment: Equipment) => {
    setSelectedEquipment(equipment)
  }

  const handleClearSelection = () => {
    setSelectedCustomer(null)
    setSelectedEquipment(null)
    setSearchTerm('')
  }

  const handleSaveService = (serviceData: any) => {
    console.log('Datos del servicio:', serviceData)
    // Aquí harías la llamada a la API para guardar el servicio
    setShowServiceForm(false)
    // Opcional: resetear selección
    // setSelectedCustomer(null)
    // setSelectedEquipment(null)
  }

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.documentNumber.includes(searchTerm)
  )

  const customerEquipments = selectedCustomer 
    ? equipments.filter(equipment => equipment.customerId === selectedCustomer.id)
    : []

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gestión de Servicios Técnicos</h1>
      
      {/* Búsqueda de clientes */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar cliente por nombre, apellido o DNI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch}>Buscar</Button>
        </div>

        <AnimatePresence>
          {isSearching && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent className="p-0">
                  {filteredCustomers.length > 0 ? (
                    <div className="max-h-60 overflow-y-auto">
                      {filteredCustomers.map(customer => (
                        <div
                          key={customer.id}
                          className="p-4 border-b hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => handleSelectCustomer(customer)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{customer.name} {customer.lastName}</p>
                              <p className="text-sm text-muted-foreground">
                                {customer.documentType}: {customer.documentNumber}
                              </p>
                            </div>
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No se encontraron clientes
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cliente seleccionado */}
      <AnimatePresence>
        {selectedCustomer && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Card className="border-primary/20">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">
                        {selectedCustomer.name} {selectedCustomer.lastName}
                      </h2>
                      <p className="text-muted-foreground">
                        {selectedCustomer.documentType}: {selectedCustomer.documentNumber}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleClearSelection}>
                    <X className="h-4 w-4 mr-1" /> Cambiar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Equipos del cliente */}
      <AnimatePresence>
        {selectedCustomer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h3 className="text-lg font-medium mb-4">Equipos registrados</h3>
            
            {customerEquipments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>Modelo</TableHead>
                    <TableHead>N° Serie</TableHead>
                    <TableHead>Último servicio</TableHead>
                    <TableHead>Seleccionar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerEquipments.map(equipment => (
                    <TableRow 
                      key={equipment.id} 
                      className={selectedEquipment?.id === equipment.id ? "bg-muted/50" : ""}
                    >
                      <TableCell className="font-medium">{equipment.type}</TableCell>
                      <TableCell>{equipment.brand}</TableCell>
                      <TableCell>{equipment.model}</TableCell>
                      <TableCell>{equipment.serialNumber}</TableCell>
                      <TableCell>{equipment.lastServiceDate}</TableCell>
                      <TableCell>
                        <Button
                          variant={selectedEquipment?.id === equipment.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleSelectEquipment(equipment)}
                        >
                          {selectedEquipment?.id === equipment.id ? 'Seleccionado' : 'Seleccionar'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="bg-muted/20 p-3 rounded-full inline-block mb-3">
                    <Monitor className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-lg mb-1">No hay equipos registrados</h3>
                  <p className="text-muted-foreground">
                    Este cliente no tiene equipos registrados en el sistema.
                  </p>
                  <Button className="mt-4">Registrar nuevo equipo</Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resumen de selección */}
      <AnimatePresence>
        {selectedEquipment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-lg"
          >
            <h3 className="font-medium text-lg mb-2">Resumen de selección</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Cliente</p>
                <p className="font-medium">{selectedCustomer?.name} {selectedCustomer?.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Documento</p>
                <p className="font-medium">{selectedCustomer?.documentNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Equipo seleccionado</p>
                <p className="font-medium">{selectedEquipment.brand} {selectedEquipment.model}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Número de serie</p>
                <p className="font-medium">{selectedEquipment.serialNumber}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setShowServiceForm(true)}>
                Continuar con el servicio
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Formulario de servicio */}
      {showServiceForm && (
        <ServiceForm
          selectedCustomer={selectedCustomer}
          selectedEquipment={selectedEquipment}
          onClose={() => setShowServiceForm(false)}
          onSave={handleSaveService}
        />
      )}
    </div>
  )
}
