// services/new/ui/components/CustomerSearchSection.tsx
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CustomerUI } from '../types';

interface CustomerSearchSectionProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  customers: CustomerUI[];
  loadingCustomers: boolean;
  onSearch: () => void;
  onSelectCustomer: (customer: CustomerUI) => void;
  onOpenCustomerModal: () => void;
  selectedCustomer: CustomerUI | null;
  onClearCustomer: () => void;
}

export function CustomerSearchSection({
  searchTerm,
  onSearchTermChange,
  customers,
  loadingCustomers,
  onSearch,
  onSelectCustomer,
  onOpenCustomerModal,
  selectedCustomer,
  onClearCustomer
}: CustomerSearchSectionProps) {
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    setIsSearching(true);
    onSearch();
  };

  const handleSelectCustomer = (customer: CustomerUI) => {
    onSelectCustomer(customer);
    setIsSearching(false);
    onSearchTermChange(''); // Limpiar búsqueda
  };

  const handleClearCustomer = () => {
    onClearCustomer();
    setIsSearching(false);
    onSearchTermChange(''); // Limpiar búsqueda
  };

  const handleNewSearch = () => {
    setIsSearching(true);
    onSearchTermChange(''); // Limpiar búsqueda anterior
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className='grid grid-cols-2 mb-2 items-center'>
          <span className="font-semibold text-base text-[#0A5CB8] flex">
            Búsqueda de Clientes
          </span>

          {!selectedCustomer && (
            <Button
              variant="outline"
              onClick={onOpenCustomerModal}
              className="border-blue-200 text-[#0A5CB8] hover:bg-blue-50"
            >
              <Plus className="h-4 w-4" /> Nuevo Cliente
            </Button>
          )}
        </div>

        {/* MOSTRAR CLIENTE SELECCIONADO */}
        <AnimatePresence>
          {selectedCustomer ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-sm text-green-800">
                      {selectedCustomer.nombre} {selectedCustomer.apellidos}
                    </p>
                    <p className="text-xs text-green-600">
                      DNI: {selectedCustomer.numero_documento}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearCustomer}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ) : (
            /* BÚSQUEDA (solo se muestra cuando no hay cliente seleccionado) */
            <motion.div
              initial={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre, apellido o DNI..."
                    value={searchTerm}
                    onChange={(e) => onSearchTermChange(e.target.value)}
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* BOTÓN PARA BUSCAR OTRO CLIENTE (solo cuando hay cliente seleccionado) */}
        <AnimatePresence>
          {selectedCustomer && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Button
                variant="outline"
                onClick={handleNewSearch}
                className="w-full border-blue-200 text-[#0A5CB8] hover:bg-blue-50"
              >
                <Search className="h-4 w-4 mr-2" />
                Buscar otro cliente
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* RESULTADOS DE BÚSQUEDA (solo se muestra cuando está buscando y no hay cliente seleccionado) */}
        <AnimatePresence>
          {isSearching && !selectedCustomer && (
            <SearchResults
              customers={customers}
              onSelectCustomer={handleSelectCustomer}
            />
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

function SearchResults({ customers, onSelectCustomer }: {
  customers: CustomerUI[];
  onSelectCustomer: (customer: CustomerUI) => void;
}) {
  return (
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
            <CustomerResultItem
              key={customer.id}
              customer={customer}
              onSelect={onSelectCustomer}
            />
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-sm text-muted-foreground border border-blue-100 rounded-lg">
          No se encontraron clientes
        </div>
      )}
    </motion.div>
  );
}

function CustomerResultItem({ customer, onSelect }: {
  customer: CustomerUI;
  onSelect: (customer: CustomerUI) => void;
}) {
  return (
    <div
      className="p-3 border-b border-blue-50 hover:bg-blue-50 cursor-pointer transition-colors"
      onClick={() => onSelect(customer)}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium text-sm">{customer.nombre} {customer.apellidos}</p>
          <p className="text-xs text-muted-foreground">
            {customer.numero_documento}
          </p>
        </div>
      </div>
    </div>
  );
}