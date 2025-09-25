// services/new/ui/modals/AvailableEquipmentsModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from 'lucide-react';
import { ServicioEquipo } from '@/interface';

interface AvailableEquipmentsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableEquipments: ServicioEquipo[];
  loadingAllEquipos: boolean;
  selectedCustomer: any;
  onSelectEquipment: (equipment: ServicioEquipo) => void;
  onOpenEquipmentModal: () => void;
}

export function AvailableEquipmentsModal({
  open,
  onOpenChange,
  availableEquipments,
  loadingAllEquipos,
  selectedCustomer,
  onSelectEquipment,
  onOpenEquipmentModal
}: AvailableEquipmentsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-[#0A5CB8]">Seleccionar Equipo Existente</DialogTitle>
          <DialogDescription>
            Elija un equipo de la lista para usarlo con el cliente {selectedCustomer?.nombre}
          </DialogDescription>
        </DialogHeader>
        
        {loadingAllEquipos ? (
          <LoadingState />
        ) : availableEquipments.length > 0 ? (
          <EquipmentTable 
            equipments={availableEquipments}
            onSelectEquipment={onSelectEquipment}
          />
        ) : (
          <EmptyState onOpenEquipmentModal={onOpenEquipmentModal} />
        )}
      </DialogContent>
    </Dialog>
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

function EquipmentTable({ equipments, onSelectEquipment }: {
  equipments: ServicioEquipo[];
  onSelectEquipment: (equipment: ServicioEquipo) => void;
}) {
  return (
    <div className="max-h-96 overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-[#0A5CB8]">Tipo</TableHead>
            <TableHead className="text-[#0A5CB8]">Marca</TableHead>
            <TableHead className="text-[#0A5CB8]">Modelo</TableHead>
            <TableHead className="text-[#0A5CB8]">N° Serie</TableHead>
            <TableHead className="text-[#0A5CB8]">Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {equipments.map((equipment) => (
            <TableRow key={equipment.idServicioEquipos}>
              <TableCell>{equipment.nombre_equipo || 'N/A'}</TableCell>
              <TableCell>{equipment.nombre_marca || 'N/A'}</TableCell>
              <TableCell>{equipment.modelo || 'N/A'}</TableCell>
              <TableCell>{equipment.serie || 'N/A'}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  onClick={() => onSelectEquipment(equipment)}
                  className="bg-[#0A5CB8] hover:bg-[#0A5CB8]/90"
                >
                  Seleccionar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function EmptyState({ onOpenEquipmentModal }: { onOpenEquipmentModal: () => void }) {
  return (
    <div className="text-center p-6">
      <p className="text-muted-foreground mb-3">No hay equipos disponibles</p>
      <Button
        onClick={onOpenEquipmentModal}
        className="bg-[#0A5CB8] hover:bg-[#0A5CB8]/90"
      >
        <Plus className="h-4 w-4 mr-1" /> Crear Nuevo Equipo
      </Button>
    </div>
  );
}