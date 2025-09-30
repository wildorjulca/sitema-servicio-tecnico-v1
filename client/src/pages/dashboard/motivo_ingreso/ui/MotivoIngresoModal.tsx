// components/motivo-ingreso/MotivoIngresoModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef } from "react";
import toast from "react-hot-toast";
import { useEnterKey } from "@/utils/hotkeys";

interface Mot {
  id: number;
  descripcion: string;
  precio_cobrar: number;
  usuarioId?: number;
}

interface MotivoIngresoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBrand: Mot | null;
  descripcion: string;
  precio_cobrar: string;
  onDescripcionChange: (value: string) => void;
  onPrecioCobrarChange: (value: string) => void;
  onSave: () => void;
  isSaving?: boolean;
}

export function MotivoIngresoModal({
  open,
  onOpenChange,
  currentBrand,
  descripcion,
  precio_cobrar,
  onDescripcionChange,
  onPrecioCobrarChange,
  onSave,
  isSaving = false
}: MotivoIngresoModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Activar Enter para guardar
  useEnterKey(handleSave, inputRef, open);

  function handleSave() {
    if (!descripcion.trim()) {
      toast.error("El nombre no puede estar vacío");
      return;
    }
    onSave();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {currentBrand ? "Editar Motivo Ingreso" : "Agregar Motivo Ingreso"}
          </DialogTitle>
        </DialogHeader>

        <Input
          ref={inputRef}
          placeholder="Nombre del Motivo Ingreso"
          value={descripcion}
          onChange={(e) => onDescripcionChange(e.target.value)}
          className="mb-4"
          disabled={isSaving}
        />
        
        <Input
          type="number"
          placeholder="Precio a cobrar"
          value={precio_cobrar}
          onChange={(e) => onPrecioCobrarChange(e.target.value)}
          className="mb-4"
          disabled={isSaving}
        />

        <DialogFooter className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Guardando..." : currentBrand ? "Actualizar" : "Agregar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}