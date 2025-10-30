// services/new/ui/components/EquipmentSelectionSection.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Monitor, Link, Plus } from 'lucide-react';
import { CustomerUI, EquipmentUI } from '../types';

interface EquipmentSelectionSectionProps {
  selectedCustomer: CustomerUI;
  customerEquipments: EquipmentUI[];
  selectedEquipment: EquipmentUI | null;
  loadingEquipos: boolean;
  onSelectEquipment: (equipment: EquipmentUI) => void;
  onOpenAvailableEquipments: () => void;
  onOpenEquipmentModal: () => void;
}

export function EquipmentSelectionSection({
  customerEquipments,
  selectedEquipment,
  loadingEquipos,
  onSelectEquipment,
  onOpenAvailableEquipments,
  onOpenEquipmentModal
}: EquipmentSelectionSectionProps) {
  return (
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
              onClick={onOpenAvailableEquipments}
              className="border-blue-200 text-[#0A5CB8] hover:bg-blue-50"
            >
              <Link className="h-4 w-4 mr-1" /> Seleccionar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenEquipmentModal}
              className="border-blue-200 text-[#0A5CB8] hover:bg-blue-50"
            >
              <Plus className="h-4 w-4 mr-1" /> Nuevo
            </Button>
          </div>
        </div>
        
        {loadingEquipos ? (
          <LoadingState />
        ) : customerEquipments.length > 0 ? (
          <EquipmentList 
            equipments={customerEquipments}
            selectedEquipment={selectedEquipment}
            onSelectEquipment={onSelectEquipment}
          />
        ) : (
          <EmptyState onOpenEquipmentModal={onOpenEquipmentModal} />
        )}
      </CardContent>
    </Card>
  );
}

function LoadingState() {
  return (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A5CB8] mx-auto"></div>
      <p className="text-sm text-muted-foreground mt-2">Cargando equipos...</p>
    </div>
  );
}

function EquipmentList({ equipments, selectedEquipment, onSelectEquipment }: {
  equipments: EquipmentUI[];
  selectedEquipment: EquipmentUI | null;
  onSelectEquipment: (equipment: EquipmentUI) => void;
}) {
  return (
    <div className="space-y-3">
      {equipments.map((equipment) => (
        <EquipmentCard
          key={equipment.id}
          equipment={equipment}
          isSelected={selectedEquipment?.id === equipment.id}
          onSelect={onSelectEquipment}
        />
      ))}
    </div>
  );
}

function EquipmentCard({ equipment, isSelected, onSelect }: {
  equipment: EquipmentUI;
  isSelected: boolean;
  onSelect: (equipment: EquipmentUI) => void;
}) {
  return (
    <div
      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'bg-[#4e90db] text-white shadow-lg transform scale-105'
          : 'bg-white border-blue-100 hover:bg-blue-50 hover:border-blue-300'
      }`}
      onClick={() => onSelect(equipment)}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-gray-900'}`}>
            {equipment.brand} {equipment.model}
          </p>
          <p className={`text-xs ${isSelected ? 'text-blue-100' : 'text-muted-foreground'}`}>
            {equipment.type} - {equipment.serialNumber}
          </p>
          <p className={`text-xs ${isSelected ? 'text-blue-100' : 'text-muted-foreground'}`}>
            Último servicio: {equipment.lastServiceDate}
          </p>
        </div>
        {isSelected && (
          <div className="bg-white text-[#0A5CB8] rounded-full p-2">
            <Monitor className="h-4 w-4" />
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ onOpenEquipmentModal }: { onOpenEquipmentModal: () => void }) {
  return (
    <div className="text-center py-8 border-2 border-dashed  rounded-lg">
      <div className="bg-blue-100 p-3 rounded-full inline-block mb-3">
        <Monitor className="h-8 w-8 text-[#0A5CB8]" />
      </div>
      <p className="text-sm text-muted-foreground mb-2">
        No hay equipos registrados para este cliente
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={onOpenEquipmentModal}
        className="border-blue-200 text-[#0A5CB8] hover:bg-blue-50"
      >
        <Plus className="h-4 w-4 mr-1" /> Registrar Primer Equipo
      </Button>
    </div>
  );
}