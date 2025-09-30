// services/new/ui/components/MotivoIngresoSimpleModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useEnterKey } from "@/utils/hotkeys";
import { useAddMotivoIngreso } from "@/hooks/useMotivoIngreso";

interface MotivoIngresoSimpleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMotivoAdded: () => void;
  usuarioId?: number;
}

export function MotivoIngresoSimpleModal({
  open,
  onOpenChange,
  onMotivoAdded,
  usuarioId
}: MotivoIngresoSimpleModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [descripcion, setDescripcion] = useState("");
  const [precio_cobrar, setPrecio_cobrar] = useState("");

  const addMotivo = useAddMotivoIngreso(usuarioId!);

  // Activar Enter para guardar
  useEnterKey(handleSave, inputRef, open);

  function handleSave() {
    if (!descripcion.trim()) {
      toast.error("El nombre no puede estar vacío");
      return;
    }

    const precioNumber = parseFloat(precio_cobrar) || 0;

    addMotivo.mutate(
      { 
        descripcion, 
        precio_cobrar: precioNumber, 
        usuarioId 
      },
      { 
        onSuccess: () => {
          setDescripcion("");
          setPrecio_cobrar("");
          onOpenChange(false);
          onMotivoAdded();
          toast.success("Motivo agregado correctamente");
        },
        onError: () => toast.error("Error al agregar el motivo")
      }
    );
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Resetear form cuando se cierra
      setDescripcion("");
      setPrecio_cobrar("");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Motivo Ingreso</DialogTitle>
        </DialogHeader>

        <Input
          ref={inputRef}
          placeholder="Nombre del Motivo Ingreso"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="mb-4"
          disabled={addMotivo.isPending}
        />
        
        <Input
          type="number"
          placeholder="Precio a cobrar"
          value={precio_cobrar}
          onChange={(e) => setPrecio_cobrar(e.target.value)}
          className="mb-4"
          disabled={addMotivo.isPending}
        />

        <DialogFooter className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={() => handleOpenChange(false)}
            disabled={addMotivo.isPending}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={addMotivo.isPending}
          >
            {addMotivo.isPending ? "Guardando..." : "Agregar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}