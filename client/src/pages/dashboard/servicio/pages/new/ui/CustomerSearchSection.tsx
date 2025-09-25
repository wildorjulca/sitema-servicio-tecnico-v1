// services/new/ui/components/CustomerSearchSection.tsx
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from 'lucide-react';
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
}

export function CustomerSearchSection({
  searchTerm,
  onSearchTermChange,
  customers,
  loadingCustomers,
  onSearch,
  onSelectCustomer,
  onOpenCustomerModal
}: CustomerSearchSectionProps) {
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    setIsSearching(true);
    onSearch();
  };

  return (
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
        
        <Button
          variant="outline"
          onClick={onOpenCustomerModal}
          className="w-full border-blue-200 text-[#0A5CB8] hover:bg-blue-50"
        >
          <Plus className="h-4 w-4 mr-2" /> Nuevo Cliente
        </Button>
        
        <AnimatePresence>
          {isSearching && (
            <SearchResults 
              customers={customers}
              onSelectCustomer={onSelectCustomer}
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