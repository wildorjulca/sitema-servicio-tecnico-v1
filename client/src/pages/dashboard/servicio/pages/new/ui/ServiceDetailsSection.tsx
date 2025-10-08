// services/new/ui/components/ServiceDetailsSection.tsx

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input"; // <- Agregar este import
import { Calendar, Save, Plus, Edit, RotateCcw } from 'lucide-react';
import { SimpleSelect } from './SimpleSelect';
import { useState, useEffect } from 'react'; // <- Agregar useEffect
import { MotivoIngresoSimpleModal } from "@/pages/dashboard/motivo_ingreso/ui/MotivoIngresoSimpleModal";

interface IF {
  id: number,
  descripcion: string,
  precio_cobrar: number
}

interface ServiceDetailsSectionProps {
  motivoIngresoId: string;
  observacion: string;
  descripcion_motivo: string;
  selectedMotivo: IF;
  safeMotivosData: IF[];
  loadingMotivos: boolean;
  isSubmitting: boolean;
  isLoading: boolean;
  onMotivoChange: (value: string) => void;
  onObservacionChange: (value: string) => void;
  onDescripcionChange: (value: string) => void;
  onSubmit: (precioFinal: number) => void; // <- Cambiar para recibir precio
  onMotivoAdded?: () => void;
  usuarioId?: number;
}

export function ServiceDetailsSection ({
  motivoIngresoId,
  observacion,
  descripcion_motivo,
  selectedMotivo,
  safeMotivosData,
  loadingMotivos,
  isSubmitting,
  isLoading,
  onMotivoChange,
  onObservacionChange,
  onDescripcionChange,
  onSubmit,
  onMotivoAdded,
  usuarioId
}: ServiceDetailsSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [precioEditable, setPrecioEditable] = useState<number>(0);
  const [isPrecioEditado, setIsPrecioEditado] = useState(false);

  // Efecto para actualizar el precio cuando cambia el motivo
  useEffect(() => {
    if (selectedMotivo && !isPrecioEditado) {
      setPrecioEditable(selectedMotivo.precio_cobrar);
    }
  }, [selectedMotivo, isPrecioEditado]);

  const handleNewMotivoSuccess = () => {
    setModalOpen(false);
    onMotivoAdded?.();
  };

  const handlePrecioChange = (value: string) => {
    const numero = parseFloat(value) || 0;
    setPrecioEditable(numero);
    setIsPrecioEditado(true);
  };

  const handleResetPrecio = () => {
    if (selectedMotivo) {
      setPrecioEditable(selectedMotivo.precio_cobrar);
      setIsPrecioEditado(false);
    }
  };

  const handleSubmit = () => {
    onSubmit(precioEditable); // Pasar el precio editable al submit
  };

  const noMotivosAvailable = !loadingMotivos && safeMotivosData.length === 0;

  return (
    <>
      <Card className="border-blue-200 shadow-lg">
        <CardContent className="p-6">
          <span className="font-semibold text-base text-[#0A5CB8] mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Detalles del Servicio
          </span>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="motivo_ingreso_id" className="text-sm font-medium">
                  Motivo de Ingreso *
                </Label>
                {!noMotivosAvailable && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-1 text-xs"
                  >
                    <Plus className="h-3 w-3" />
                    Nuevo Motivo
                  </Button>
                )}
              </div>

              {loadingMotivos ? (
                <div className="p-3 border rounded-md text-center text-muted-foreground">
                  Cargando motivos...
                </div>
              ) : noMotivosAvailable ? (
                <div className="text-center space-y-3">
                  <div className="p-4 border border-dashed border-gray-300 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-3">
                      No hay motivos de ingreso disponibles
                    </p>
                    <Button
                      onClick={() => setModalOpen(true)}
                      className="flex items-center gap-2"
                      variant="default"
                    >
                      <Plus className="h-4 w-4" />
                      Crear Primer Motivo de Ingreso
                    </Button>
                  </div>
                </div>
              ) : (
                <SimpleSelect
                  options={safeMotivosData}
                  value={motivoIngresoId}
                  onValueChange={(value) => {
                    onMotivoChange(value);
                    setIsPrecioEditado(false); // Resetear estado de edición al cambiar motivo
                  }}
                  placeholder="Seleccione un motivo de ingreso..."
                  emptyMessage="No hay motivos disponibles"
                />
              )}
            </div>

            {selectedMotivo && (
              <PriceInput 
                precioDefault={selectedMotivo.precio_cobrar}
                precioEditable={precioEditable}
                isEditado={isPrecioEditado}
                onPrecioChange={handlePrecioChange}
                onResetPrecio={handleResetPrecio}
              />
            )}

            <div className="space-y-2">
              <Label htmlFor="descripcion" className="text-sm font-medium">
                Configuracion Extra
              </Label>
              <Textarea
                id="descripcion"
                value={descripcion_motivo}
                onChange={(e) => onDescripcionChange(e.target.value)}
                placeholder="El cliente ingresa por x motivo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacion" className="text-sm font-medium">
                Observaciones del Equipo
              </Label>
              <Textarea
                id="observacion"
                value={observacion}
                onChange={(e) => onObservacionChange(e.target.value)}
                placeholder="Observaciones sobre el estado del equipo, accesorios, etc..."
              />
            </div>

            <SubmitButton
              disabled={isSubmitting || isLoading || !motivoIngresoId}
              isSubmitting={isSubmitting || isLoading}
              onSubmit={handleSubmit}
            />
          </div>
        </CardContent>
      </Card>

      <MotivoIngresoSimpleModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onMotivoAdded={handleNewMotivoSuccess}
        usuarioId={usuarioId}
      />
    </>
  );
}

// Componente para el precio editable
function PriceInput({ 
  precioDefault, 
  precioEditable, 
  isEditado, 
  onPrecioChange, 
  onResetPrecio 
}: {
  precioDefault: number;
  precioEditable: number;
  isEditado: boolean;
  onPrecioChange: (value: string) => void;
  onResetPrecio: () => void;
}) {
  return (
    <div className={`p-4 border rounded-lg space-y-3 ${
      isEditado ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'
    }`}>
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Edit className={`h-4 w-4 ${isEditado ? 'text-yellow-600' : 'text-green-600'}`} />
          Precio del servicio {isEditado && '(Editado)'}
        </Label>
        {isEditado && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onResetPrecio}
            className="text-xs h-7 px-2"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Original
          </Button>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Input
            type="number"
            value={precioEditable}
            onChange={(e) => onPrecioChange(e.target.value)}
            className={`text-lg font-bold ${
              isEditado ? 'text-yellow-800' : 'text-green-800'
            }`}
            min="0"
            step="0.01"
          />
        </div>
        <span className={`text-lg font-bold ${
          isEditado ? 'text-yellow-800' : 'text-green-800'
        }`}>
          S/.
        </span>
      </div>
      
      {isEditado && (
        <div className="text-xs text-muted-foreground">
          Precio original: S/. {precioDefault}
        </div>
      )}
    </div>
  );
}

function SubmitButton({ disabled, isSubmitting, onSubmit }: {
  disabled: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
}) {
  return (
    <Button
      onClick={onSubmit}
      disabled={disabled}
      className="w-full bg-[#0A5CB8] hover:bg-[#0A5CB8]/90"
      size="lg"
    >
      {isSubmitting ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Registrando Servicio...
        </>
      ) : (
        <>
          <Save className="h-5 w-5 mr-2" />
          Registrar Servicio Completo
        </>
      )}
    </Button>
  );
}