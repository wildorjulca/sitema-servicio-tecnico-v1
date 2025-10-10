// Repare.tsx - VERSIÓN COMPLETA CON HOOK DE REPUESTOS
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Save, Loader2, ReceiptIndianRupee, Package } from 'lucide-react';
import BuscarRepuestos from './BuscarRepuestos';
import ResumenCostos from './ResumenCostos';
import RepuestosList from './RepuestosList';
import { useUser } from '@/hooks/useUser';
import { toast } from 'sonner';
import { 
  useServicioReparacion2, 
  useGuardarAvanceTecnico,
  useAgregarRepuestos,
  useFinalizarReparacion,
  useObtenerRepuestosServicio // ✅ NUEVO HOOK
} from '@/hooks/useService';

interface ServicioData {
  idServicio?: number;
  servicio_id?: number;
  diagnostico?: string;
  solucion?: string;
  precio_mano_obra?: number;
  estado_id?: number;
  repuestos?: any[];
}

interface RepareProps {
  servicioData: ServicioData;
}

const Repare = ({ servicioData }: RepareProps) => {
  const { user } = useUser();
  const usuarioId = user?.id;
  const isSecretaria = user?.rol === 'SECRETARIA';

  console.log('servicioData recibido en Repare:', servicioData);
  console.log('Rol del usuario:', user?.rol);

  // ✅ ESTADO INICIAL CORREGIDO
  const [servicio, setServicio] = useState(() => {
    const servicioId = servicioData?.servicio_id || servicioData?.idServicio || 0;

    return {
      servicio_id: servicioId,
      diagnostico: servicioData?.diagnostico || '',
      solucion: servicioData?.solucion || '',
      precio_mano_obra: servicioData?.precio_mano_obra || 0,
      estado_id: servicioData?.estado_id || 2,
      repuestos: servicioData?.repuestos || []
    };
  });

  // ✅ HOOK PARA OBTENER REPUESTOS
  const { 
    data: repuestosData, 
    refetch: refetchRepuestos, 
    isLoading: isLoadingRepuestos,
    error: errorRepuestos 
  } = useObtenerRepuestosServicio(servicio.servicio_id);

  // ✅ USAR LOS NUEVOS HOOKS
  const { mutate: actualizarServicio, isPending: isPendingAntiguo } = useServicioReparacion2();
  const { mutate: guardarAvance, isPending: isPendingAvance } = useGuardarAvanceTecnico();
  const { mutate: agregarRepuestos, isPending: isPendingRepuestos } = useAgregarRepuestos();
  const { mutate: finalizarReparacion, isPending: isPendingFinalizar } = useFinalizarReparacion();

  const isPending = isPendingAntiguo || isPendingAvance || isPendingRepuestos || isPendingFinalizar;

  // ✅ EFFECT PARA SINCRONIZAR REPUESTOS AL CARGAR
  useEffect(() => {
    if (repuestosData?.success && repuestosData.data) {
      console.log('📦 Repuestos cargados:', repuestosData.data);
      setServicio(prev => ({
        ...prev,
        repuestos: repuestosData.data
      }));
    }
  }, [repuestosData]);

  // ✅ EFFECT PARA RECARGAR REPUESTOS DESPUÉS DE ACCIONES
  useEffect(() => {
    if (!isPending) {
      refetchRepuestos();
    }
  }, [isPending, refetchRepuestos]);

  // ✅ EFFECT PARA DEBUG
  useEffect(() => {
    console.log('🔍 DEBUG REPUESTOS:');
    console.log('servicio_id:', servicio.servicio_id);
    console.log('repuestosData:', repuestosData);
    console.log('servicio.repuestos:', servicio.repuestos);
    console.log('errorRepuestos:', errorRepuestos);
  }, [servicio.servicio_id, repuestosData, servicio.repuestos, errorRepuestos]);

  // Si no hay servicio_id válido, mostrar error
  if (servicio.servicio_id === 0) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error: No se pudo cargar el servicio</p>
          <p className="text-sm text-gray-500">Verifica que el servicio exista</p>
        </div>
      </div>
    );
  }

  // ✅ FUNCIONES PARA REPUESTOS CON VALIDACIÓN DE ROL
  const agregarRepuesto = (producto: any) => {
    if (!isSecretaria) {
      toast.error('Solo la secretaria puede agregar repuestos');
      return;
    }

    const repuestoExistente = servicio.repuestos.find((r: any) => r.producto_id === producto.id);

    if (repuestoExistente) {
      const nuevosRepuestos = servicio.repuestos.map((repuesto: any) =>
        repuesto.producto_id === producto.id
          ? { ...repuesto, cantidad: repuesto.cantidad + 1 }
          : repuesto
      );
      setServicio({ ...servicio, repuestos: nuevosRepuestos });
    } else {
      const repuesto = {
        producto_id: producto.id,
        nombre: producto.nombre,
        cantidad: 1,
        precio_unitario: producto.precio_venta
      };
      setServicio({
        ...servicio,
        repuestos: [...servicio.repuestos, repuesto]
      });
    }
  };

  const eliminarRepuesto = (index: number) => {
    if (!isSecretaria) {
      toast.error('Solo la secretaria puede eliminar repuestos');
      return;
    }

    const nuevosRepuestos = servicio.repuestos.filter((_, i) => i !== index);
    setServicio({ ...servicio, repuestos: nuevosRepuestos });
  };

  const actualizarCantidadRepuesto = (index: number, nuevaCantidad: number) => {
    if (!isSecretaria) {
      toast.error('Solo la secretaria puede modificar repuestos');
      return;
    }

    if (nuevaCantidad < 1) return;

    const nuevosRepuestos = servicio.repuestos.map((repuesto: any, i: number) =>
      i === index ? { ...repuesto, cantidad: nuevaCantidad } : repuesto
    );
    setServicio({ ...servicio, repuestos: nuevosRepuestos });
  };

  const calcularTotales = () => {
    const totalRepuestos = servicio.repuestos.reduce((sum: number, repuesto: any) =>
      sum + (repuesto.cantidad * repuesto.precio_unitario), 0
    );
    const precioTotal = servicio.precio_mano_obra + totalRepuestos;

    return { totalRepuestos, precioTotal };
  };

  // ✅ FUNCIONES CORREGIDAS CON VALIDACIÓN DE ROL
  const handleGuardarAvance = () => {
    if (!usuarioId) {
      toast.error('Usuario no autenticado');
      return;
    }

    if (isSecretaria) {
      toast.error('Solo los técnicos pueden guardar avances de reparación');
      return;
    }

    const payload = {
      servicio_id: servicio.servicio_id,
      diagnostico: servicio.diagnostico,
      solucion: servicio.solucion,
      precio_mano_obra: Number(servicio.precio_mano_obra),
      usuario_soluciona_id: usuarioId
    };

    console.log('Técnico - Guardando avance:', payload);
    guardarAvance(payload);
  };

  const handleAgregarRepuestos = () => {
    if (!usuarioId) {
      toast.error('Usuario no autenticado');
      return;
    }

    if (!isSecretaria) {
      toast.error('Solo la secretaria puede agregar repuestos');
      return;
    }

    const payload = {
      servicio_id: servicio.servicio_id,
      repuestos: servicio.repuestos.map((repuesto: any) => ({
        producto_id: repuesto.producto_id,
        cantidad: Number(repuesto.cantidad),
        precio_unitario: Number(repuesto.precio_unitario)
      })),
      usuario_agrega_id: usuarioId
    };

    console.log('Secretaria - Agregando repuestos:', payload);
    agregarRepuestos(payload, {
      onSuccess: () => {
        // ✅ RECARGAR REPUESTOS DESPUÉS DE AGREGAR
        refetchRepuestos();
        toast.success('Repuestos guardados correctamente');
      }
    });
  };

  const handleFinalizarReparacion = () => {
    if (!usuarioId) {
      toast.error('Usuario no autenticado');
      return;
    }

    if (isSecretaria) {
      toast.error('Solo los técnicos pueden finalizar reparaciones');
      return;
    }

    const payload = {
      servicio_id: servicio.servicio_id,
      usuario_soluciona_id: usuarioId
    };

    console.log('Finalizando reparación:', payload);
    finalizarReparacion(payload);
  };

  const { totalRepuestos, precioTotal } = calcularTotales();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {isSecretaria ? "📦 Agregar Repuestos" : "🔧 Completar Reparación - Paso 2"}
        </h1>
        <div className="flex items-center gap-4">
          <Badge variant={servicio.estado_id === 2 ? "secondary" : "default"}>
            {servicio.estado_id === 2 ? "En Reparación" : "Reparado"}
          </Badge>
          <span className="text-sm text-gray-500">ID: #{servicio.servicio_id}</span>
          <Badge variant="outline" className={isSecretaria ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}>
            {isSecretaria ? "Secretaria" : "Técnico"}
          </Badge>
        </div>
      </div>

      {/* ✅ INDICADOR DE REPUESTOS CARGADOS */}
      {repuestosData?.success && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-blue-600" />
            <span className="text-blue-700 text-sm">
              {servicio.repuestos.length} repuesto(s) cargados
              {servicio.repuestos.length > 0 && ' - Actualizado en tiempo real'}
            </span>
          </div>
        </div>
      )}

      {/* ✅ ERROR AL CARGAR REPUESTOS */}
      {errorRepuestos && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <div className="flex items-center gap-2">
            <span className="text-red-700 text-sm">
              Error al cargar repuestos: {errorRepuestos.message}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ✅ SECCIÓN DIAGNÓSTICO/SOLUCIÓN - SOLO TÉCNICO */}
        {!isSecretaria && (
          <Card>
            <CardHeader>
              <CardTitle>Completar Reparación</CardTitle>
              <CardDescription>
                Servicio ID: #{servicio.servicio_id}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="diagnostico">Diagnóstico *</Label>
                <Textarea
                  id="diagnostico"
                  value={servicio.diagnostico}
                  onChange={(e) => setServicio({ ...servicio, diagnostico: e.target.value })}
                  placeholder="Ingrese el diagnóstico..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="solucion">Solución Aplicada *</Label>
                <Textarea
                  id="solucion"
                  value={servicio.solucion}
                  onChange={(e) => setServicio({ ...servicio, solucion: e.target.value })}
                  placeholder="Describa la solución..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="precio_mano_obra">Precio Mano de Obra ($)</Label>
                <Input
                  id="precio_mano_obra"
                  type="number"
                  step="0"
                  min={0}
                  value={servicio.precio_mano_obra}
                  onChange={(e) => setServicio({ ...servicio, precio_mano_obra: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          {/* ✅ SECCIÓN REPUESTOS - VISIBLE PARA AMBOS */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg">Repuestos Utilizados</CardTitle>
                <CardDescription className="text-sm">
                  {servicio.repuestos.length} repuesto(s)
                  {!isSecretaria && " - Solo lectura"}
                  {!isSecretaria && servicio.repuestos.length > 0 && " (Agregados por secretaria)"}
                </CardDescription>
              </div>
              {/* BUSCAR REPUESTOS SOLO PARA SECRETARIA */}
              {isSecretaria && <BuscarRepuestos agregarRepuesto={agregarRepuesto} />}
            </CardHeader>
            <CardContent className="pt-0">
              {isLoadingRepuestos ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-500">Cargando repuestos...</span>
                </div>
              ) : (
                <RepuestosList
                  repuestos={servicio.repuestos}
                  actualizarCantidadRepuesto={isSecretaria ? actualizarCantidadRepuesto : undefined}
                  eliminarRepuesto={isSecretaria ? eliminarRepuesto : undefined}
                  modoLectura={!isSecretaria}
                  mostrarAgregadoPor={!isSecretaria}
                />
              )}
            </CardContent>
          </Card>

          {/* ✅ RESUMEN DE COSTOS - VISIBLE PARA AMBOS */}
          <ResumenCostos
            manoObra={servicio.precio_mano_obra}
            totalRepuestos={totalRepuestos}
            precioTotal={precioTotal}
          />

          {/* ✅ BOTONES SEGÚN ROL */}
          <div className='xl:grid-cols-2 grid gap-3 sm:grid-cols-1'>
            {isSecretaria ? (
              // ✅ BOTONES SECRETARIA
              <Button
                onClick={handleAgregarRepuestos}
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={isPending}
                size="lg"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Repuestos
                  </>
                )}
              </Button>
            ) : (
              // ✅ BOTONES TÉCNICO
              <>
                <Button
                  onClick={handleGuardarAvance}
                  className="w-full"
                  disabled={isPending || !usuarioId}
                  size="lg"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <ReceiptIndianRupee className="w-4 h-4 mr-2" />
                      Guardar Avance
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleFinalizarReparacion}
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={isPending || !usuarioId}
                  size="lg"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Finalizando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Finalizar Reparación
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Repare;