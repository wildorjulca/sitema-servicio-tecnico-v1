// services/new/ui/components/ServiceDetailsSection.tsx

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Calendar, Save, Plus, Edit, RotateCcw, Trash2 } from 'lucide-react';
import { SimpleSelect } from './SimpleSelect';
import { useState, useEffect } from 'react';
import { MotivoIngresoSimpleModal } from "@/pages/dashboard/motivo_ingreso/ui/MotivoIngresoSimpleModal";

interface IF {
  id: number,
  descripcion: string,
  precio_cobrar: number
}

// NUEVA INTERFACE para los motivos seleccionados
interface MotivoSeleccionado {
  motivo_ingreso_id: number;
  descripcion_adicional: string;
  precio_motivo: number;
  motivo_nombre?: string; // Para mostrar en la UI
}

interface ServiceDetailsSectionProps {
  // CAMBIO: Ahora manejamos array de motivos
  motivosSeleccionados: MotivoSeleccionado[];
  observacion: string;
  safeMotivosData: IF[];
  loadingMotivos: boolean;
  isSubmitting: boolean;
  isLoading: boolean;
  // CAMBIO: Nuevas funciones para manejar array
  onMotivoAdd: (motivo: MotivoSeleccionado) => void;
  onMotivoRemove: (index: number) => void;
  onMotivoUpdate: (index: number, motivo: MotivoSeleccionado) => void;
  onObservacionChange: (value: string) => void;
  onSubmit: (precioTotal: number) => void;
  onMotivoAdded?: () => void;
  usuarioId?: number;
}

export function ServiceDetailsSection({
  motivosSeleccionados,
  observacion,
  safeMotivosData,
  loadingMotivos,
  isSubmitting,
  isLoading,
  onMotivoAdd,
  onMotivoRemove,
  onMotivoUpdate,
  onObservacionChange,
  onSubmit,
  onMotivoAdded,
  usuarioId
}: ServiceDetailsSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [motivoTemporal, setMotivoTemporal] = useState<{
    motivoId: string;
    descripcion: string;
    precio: number;
  }>({
    motivoId: '',
    descripcion: '',
    precio: 0
  });

  // Calcular precio total sumando todos los motivos
  const precioTotal = motivosSeleccionados.reduce((total, motivo) => total + motivo.precio_motivo, 0);

  // Actualizar precio cuando se selecciona un motivo
  useEffect(() => {
    if (motivoTemporal.motivoId) {
      const motivo = safeMotivosData.find(m => m.id === parseInt(motivoTemporal.motivoId));
      if (motivo && motivoTemporal.precio === 0) {
        setMotivoTemporal(prev => ({
          ...prev,
          precio: motivo.precio_cobrar
        }));
      }
    }
  }, [motivoTemporal.motivoId, safeMotivosData]);

  const handleNewMotivoSuccess = () => {
    setModalOpen(false);
    onMotivoAdded?.();
  };

  const handleAddMotivo = () => {
    if (!motivoTemporal.motivoId) return;

    const motivoData = safeMotivosData.find(m => m.id === parseInt(motivoTemporal.motivoId));
    if (!motivoData) return;

    const nuevoMotivo: MotivoSeleccionado = {
      motivo_ingreso_id: motivoData.id,
      descripcion_adicional: "",
      precio_motivo: motivoTemporal.precio,
      motivo_nombre: motivoData.descripcion
    };

    onMotivoAdd(nuevoMotivo);

    // Resetear formulario temporal
    setMotivoTemporal({
      motivoId: '',
      descripcion: '',
      precio: 0
    });
  };

  const handleUpdateMotivoPrecio = (index: number, nuevoPrecio: number) => {
    const motivoActualizado = {
      ...motivosSeleccionados[index],
      precio_motivo: nuevoPrecio
    };
    onMotivoUpdate(index, motivoActualizado);
  };

  const handleSubmit = () => {
    onSubmit(precioTotal);
  };

  const noMotivosAvailable = !loadingMotivos && safeMotivosData.length === 0;

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <span className="font-semibold text-base text-[#0A5CB8] mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Mas Detalles
          </span>

          <div className="space-y-4">
            {/* SECCIÓN PARA AGREGAR NUEVOS MOTIVOS */}
            <div className="space-y-3 p-4 border border-dashed border-gray-300 rounded-lg">
              <Label className="text-sm font-medium flex items-center justify-between">
                <span>Agregar Motivo de Ingreso</span>
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
              </Label>

              {loadingMotivos ? (
                <div className="p-3 border rounded-md text-center text-muted-foreground">
                  Cargando motivos...
                </div>
              ) : noMotivosAvailable ? (
                <div className="text-center space-y-3">
                  <p className="text-sm text-muted-foreground">
                    No hay motivos de ingreso disponibles
                  </p>
                  <Button
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-2"
                    variant="default"
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
                    Crear Primer Motivo
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <SimpleSelect
                    options={safeMotivosData}
                    value={motivoTemporal.motivoId}
                    onValueChange={(value) => setMotivoTemporal(prev => ({ ...prev, motivoId: value }))}
                    placeholder="Seleccione un motivo..."
                    emptyMessage="No hay motivos disponibles"
                  />

                  {motivoTemporal.motivoId && (
                    <>

                      <PriceInput
                        precioDefault={safeMotivosData.find(m => m.id === parseInt(motivoTemporal.motivoId))?.precio_cobrar || 0}
                        precioEditable={motivoTemporal.precio}
                        isEditado={motivoTemporal.precio !== (safeMotivosData.find(m => m.id === parseInt(motivoTemporal.motivoId))?.precio_cobrar || 0)}
                        onPrecioChange={(value) => setMotivoTemporal(prev => ({ ...prev, precio: parseFloat(value) || 0 }))}
                        onResetPrecio={() => {
                          const motivo = safeMotivosData.find(m => m.id === parseInt(motivoTemporal.motivoId));
                          if (motivo) {
                            setMotivoTemporal(prev => ({ ...prev, precio: motivo.precio_cobrar }));
                          }
                        }}
                      />

                      <Button
                        type="button"
                        onClick={handleAddMotivo}
                        className="w-full"
                        variant="outline"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Motivo
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* LISTA DE MOTIVOS SELECCIONADOS */}
            {motivosSeleccionados.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Motivos Seleccionados ({motivosSeleccionados.length})
                </Label>

                {motivosSeleccionados.map((motivo, index) => (
                  <MotivoCard
                    key={index}
                    motivo={motivo}
                    index={index}
                    onPrecioChange={handleUpdateMotivoPrecio}
                    onRemove={onMotivoRemove}
                  />
                ))}

                {/* PRECIO TOTAL */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <Label className="text-lg font-bold text-blue-800">
                      Precio Total del Servicio
                    </Label>
                    <span className="text-xl font-bold text-blue-800">
                      S/. {precioTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* OBSERVACIONES */}
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

            {/* BOTÓN DE ENVÍO */}
            <SubmitButton
              disabled={isSubmitting || isLoading || motivosSeleccionados.length === 0}
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

// Componente para cada motivo seleccionado
function MotivoCard({ 
  motivo, 
  index, 
  onPrecioChange, 
  onRemove 
}: {
  motivo: MotivoSeleccionado;
  index: number;
  onPrecioChange: (index: number, precio: number) => void;
  onRemove: (index: number) => void;
}) {
  const [inputValue, setInputValue] = useState(motivo.precio_motivo.toString());

  // Sincronizar cuando el precio cambia desde fuera
  useEffect(() => {
    setInputValue(motivo.precio_motivo.toString());
  }, [motivo.precio_motivo]);

  const handleInputChange = (value: string) => {
    // Permitir campo vacío temporalmente
    if (value === '') {
      setInputValue('');
      onPrecioChange(index, 0);
      return;
    }

    // Remover ceros iniciales
    let cleanedValue = value;
    if (value.length > 1 && value.startsWith('0') && !value.startsWith('0.')) {
      cleanedValue = value.replace(/^0+/, '');
      if (cleanedValue === '') cleanedValue = '0';
    }

    setInputValue(cleanedValue);
    
    // Convertir a número y enviar al padre
    const numero = parseFloat(cleanedValue) || 0;
    onPrecioChange(index, numero);
  };

  const handleBlur = () => {
    // Al perder el foco, asegurarse de que tenga un valor válido
    if (inputValue === '' || inputValue === '0') {
      setInputValue('0');
      onPrecioChange(index, 0);
    }
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-white">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="font-medium text-sm">{motivo.motivo_nombre}</h4>
          {motivo.descripcion_adicional && (
            <p className="text-sm text-muted-foreground mt-1">
              {motivo.descripcion_adicional}
            </p>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium whitespace-nowrap">Precio:</Label>
        <div className="flex items-center gap-1 flex-1">
          <Input
            type="text" // Cambiar a text
            inputMode="decimal"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onBlur={handleBlur}
            className="h-8 text-sm"
            placeholder="0"
          />
          <span className="text-sm font-medium">S/.</span>
        </div>
      </div>
    </div>
  );
}

// Componente para el precio editable (se mantiene igual)
// Componente para el precio editable - CORREGIDO
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
  // Usar estado local para manejar el valor como string
  const [inputValue, setInputValue] = useState(precioEditable.toString());

  // Sincronizar cuando cambia el precioEditable desde fuera
  useEffect(() => {
    setInputValue(precioEditable.toString());
  }, [precioEditable]);

  const handleInputChange = (value: string) => {
    // Permitir campo vacío temporalmente
    if (value === '') {
      setInputValue('');
      onPrecioChange('0');
      return;
    }

    // Remover ceros iniciales excepto si es "0." o similar
    let cleanedValue = value;

    // Si empieza con 0 y tiene más dígitos, quitar el 0 inicial
    if (value.length > 1 && value.startsWith('0') && !value.startsWith('0.')) {
      cleanedValue = value.replace(/^0+/, '');
      // Si quedó vacío, poner 0
      if (cleanedValue === '') cleanedValue = '0';
    }

    setInputValue(cleanedValue);

    // Convertir a número y enviar al padre
    const numero = parseFloat(cleanedValue) || 0;
    onPrecioChange(cleanedValue); // Enviar el string limpio
  };

  const handleBlur = () => {
    // Al perder el foco, asegurarse de que tenga un valor válido
    if (inputValue === '' || inputValue === '0') {
      setInputValue('0');
      onPrecioChange('0');
    }
  };

  return (
    <div className={`p-4 border rounded-lg space-y-3 ${isEditado ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'
      }`}>
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Edit className={`h-4 w-4 ${isEditado ? 'text-yellow-600' : 'text-green-600'}`} />
          Precio del motivo {isEditado && '(Editado)'}
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
            type="text" // Cambiar a text para mejor control
            inputMode="decimal" // Para teclado numérico en móviles
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onBlur={handleBlur}
            className={`text-lg font-bold ${isEditado ? 'text-yellow-800' : 'text-green-800'
              }`}
            placeholder="0"
          />
        </div>
        <span className={`text-lg font-bold ${isEditado ? 'text-yellow-800' : 'text-green-800'
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

// Botón de envío (se mantiene igual)
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