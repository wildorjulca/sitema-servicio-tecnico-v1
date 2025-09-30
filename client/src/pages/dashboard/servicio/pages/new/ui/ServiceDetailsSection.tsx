// services/new/ui/components/ServiceDetailsSection.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Save, Plus } from 'lucide-react';
import { SimpleSelect } from './SimpleSelect';
import { useState } from 'react';
import { MotivoIngresoSimpleModal } from "@/pages/dashboard/motivo_ingreso/ui/MotivoIngresoSimpleModal";

interface ServiceDetailsSectionProps {
  motivoIngresoId: string;
  observacion: string;
  descripcion_motivo: string;
  selectedMotivo: any;
  safeMotivosData: any[];
  loadingMotivos: boolean;
  isSubmitting: boolean;
  isLoading: boolean;
  onMotivoChange: (value: string) => void;
  onObservacionChange: (value: string) => void;
  onDescripcionChange: (value: string) => void;
  onSubmit: () => void;
  onMotivoAdded?: () => void;
  usuarioId?: number;
}

export function ServiceDetailsSection({
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

  const handleNewMotivoSuccess = () => {
    setModalOpen(false);
    onMotivoAdded?.();
  };

  // Verificar si no hay motivos disponibles
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
                  onValueChange={onMotivoChange}
                  placeholder="Seleccione un motivo de ingreso..."
                  emptyMessage="No hay motivos disponibles"
                />
              )}
            </div>

            {selectedMotivo && (
              <PriceDisplay precio={selectedMotivo.precio_cobrar} />
            )}

            <div className="space-y-2">
              <Label htmlFor="descripcion" className="text-sm font-medium">
                Descripción Motivo Ingreso
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
              onSubmit={onSubmit}
            />
          </div>
        </CardContent>
      </Card>

      {/* Modal simplificado para agregar nuevo motivo */}
      <MotivoIngresoSimpleModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onMotivoAdded={handleNewMotivoSuccess}
        usuarioId={usuarioId}
      />
    </>
  );
}

function PriceDisplay({ precio }: { precio: number }) {
  return (
    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-green-800">
          Precio del servicio:
        </span>
        <span className="text-lg font-bold text-green-800">
          S/. {precio}
        </span>
      </div>
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