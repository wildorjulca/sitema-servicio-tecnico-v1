// components/Repare.tsx - VERSIÓN MEJORADA CON HOOK PROPIO
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // ✅ AGREGAR
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Save, Loader2, ReceiptIndianRupee, Package, Trash2 } from 'lucide-react';
import BuscarRepuestos from './BuscarRepuestos';
import ResumenCostos from './ResumenCostos';
import RepuestosList from './RepuestosList';
import { useUser } from '@/hooks/useUser';
import { toast } from 'sonner';
import {
  useGuardarAvanceTecnico,
  useAgregarRepuestos,
  useEliminarRepuestos,
  useFinalizarReparacion,
  useObtenerRepuestosServicio,
  useServiceyId // ✅ AGREGAR ESTE HOOK
} from '@/hooks/useService';

// ✅ INTERFACE ACTUALIZADA (puedes mantener servicioData como opcional)
interface RepareProps {
  servicioData?: any; // Opcional, por si acaso
}

const Repare = ({ servicioData }: RepareProps) => {
  const { id } = useParams<{ id: string }>(); // ✅ OBTENER ID DE LA URL
  const { user } = useUser();
  const usuarioId = user?.id;
  const isSecretaria = user?.rol === 'SECRETARIA';

  // ✅ OBTENER DATOS COMPLETOS DEL SERVICIO CON EL HOOK
  const { data: servicioCompleto, isLoading: isLoadingServicio, error: errorServicio } = useServiceyId(usuarioId, id);

  const [servicio, setServicio] = useState({
    servicio_id: parseInt(id || '0'),
    diagnostico: '',
    solucion: '',
    precio_mano_obra: 0,
    estado_id: 2,
    repuestos: []
  });

  const [repuestosSeleccionados, setRepuestosSeleccionados] = useState<number[]>([]);
  const [modoSeleccion, setModoSeleccion] = useState(false);

  const {
    data: repuestosData,
    refetch: refetchRepuestos,
    isLoading: isLoadingRepuestos,
    error: errorRepuestos
  } = useObtenerRepuestosServicio(servicio.servicio_id);

  const { mutate: guardarAvance, isPending: isPendingAvance } = useGuardarAvanceTecnico();
  const { mutate: agregarRepuestos, isPending: isPendingAgregar } = useAgregarRepuestos();
  const { mutate: eliminarRepuestos, isPending: isPendingEliminar } = useEliminarRepuestos();
  const { mutate: finalizarReparacion, isPending: isPendingFinalizar } = useFinalizarReparacion();

  const isPending = isPendingAvance || isPendingAgregar || isPendingEliminar || isPendingFinalizar;

  // ✅ INICIALIZAR CON DATOS DEL SERVICIO CUANDO LLEGUEN
  useEffect(() => {
    if (servicioCompleto) {
      console.log('🎯 Datos completos del servicio cargados:', servicioCompleto);
      setServicio(prev => ({
        ...prev,
        servicio_id: servicioCompleto.idServicio,
        diagnostico: servicioCompleto.diagnostico || '',
        solucion: servicioCompleto.solucion || '',
        precio_mano_obra: servicioCompleto.precio || 0, // precio es mano de obra
        estado_id: servicioCompleto.estado_id || prev.estado_id
      }));
    }
  }, [servicioCompleto]);

  // ✅ ACTUALIZAR REPUESTOS CUANDO LLEGUEN DEL HOOK
  useEffect(() => {
    if (repuestosData?.success && repuestosData.data) {
      setServicio(prev => ({
        ...prev,
        repuestos: repuestosData.data
      }));
    }
  }, [repuestosData]);

  useEffect(() => {
    if (repuestosData?.success) {
      setRepuestosSeleccionados([]);
    }
  }, [repuestosData]);

  // ✅ MOSTRAR LOADING MIENTRAS CARGA EL SERVICIO
  if (isLoadingServicio) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando datos del servicio...</p>
        </div>
      </div>
    );
  }

  // ✅ MOSTRAR ERROR SI FALLA LA CARGA
  if (errorServicio || !servicioCompleto) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8 text-red-600">
          <h2 className="text-xl font-bold mb-2">Error al cargar el servicio</h2>
          <p>No se pudieron cargar los datos del servicio. Verifica que el servicio exista.</p>
          <Button 
            onClick={() => window.history.back()} 
            className="mt-4"
            variant="outline"
          >
            Volver atrás
          </Button>
        </div>
      </div>
    );
  }

  // ✅ DEBUG: Verificar datos cargados
  console.log('📊 Estado actual del servicio:', servicio);

  // ... (TODAS TUS FUNCIONES EXISTENTES SE MANTIENEN IGUAL)
  // handleGuardarTodosLosCambios, handleSeleccionRepuesto, handleActivarModoSeleccion, etc.
  // ⚠️ SOLO COPIAR DESDE AQUÍ HACIA ABAJO LAS FUNCIONES QUE YA TIENES

  const handleGuardarTodosLosCambios = async () => {
    if (!usuarioId) {
      toast.error('Usuario no autenticado');
      return;
    }

    if (!isSecretaria) {
      toast.error('Solo la secretaria puede guardar cambios');
      return;
    }

    // 1️⃣ ELIMINAR repuestos seleccionados
    const eliminacionesPromesas = [];
    if (repuestosSeleccionados.length > 0) {
      eliminacionesPromesas.push(
        eliminarRepuestos({
          servicio_id: servicio.servicio_id,
          repuestos_ids: repuestosSeleccionados,
          usuario_elimina_id: usuarioId
        })
      );
    }

    // 2️⃣ AGREGAR repuestos nuevos
    const repuestosNuevos = servicio.repuestos.filter(repuesto => !repuesto.id);
    const agregadosPromesas = [];
    if (repuestosNuevos.length > 0) {
      agregadosPromesas.push(
        agregarRepuestos({
          servicio_id: servicio.servicio_id,
          repuestos: repuestosNuevos.map((repuesto: any) => ({
            producto_id: repuesto.producto_id,
            cantidad: Number(repuesto.cantidad),
            precio_unitario: Number(repuesto.precio_unitario)
          })),
          usuario_agrega_id: usuarioId
        })
      );
    }

    // Si no hay cambios
    if (eliminacionesPromesas.length === 0 && agregadosPromesas.length === 0) {
      toast.info('No hay cambios para guardar');
      return;
    }

    try {
      await Promise.all([...eliminacionesPromesas, ...agregadosPromesas]);
      refetchRepuestos();
      setModoSeleccion(false);
      setRepuestosSeleccionados([]);
      toast.success('Todos los cambios guardados correctamente');
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      toast.error('Error al guardar cambios');
    }
  };

  const hayCambiosPendientes = () => {
    const repuestosNuevos = servicio.repuestos.filter(repuesto => !repuesto.id).length;
    const repuestosAEliminar = repuestosSeleccionados.length;
    return repuestosNuevos > 0 || repuestosAEliminar > 0;
  };

  const handleSeleccionRepuesto = (repuestoId: number, seleccionado: boolean) => {
    if (seleccionado) {
      setRepuestosSeleccionados(prev => [...prev, repuestoId]);
    } else {
      setRepuestosSeleccionados(prev => prev.filter(id => id !== repuestoId));
    }
  };

  const handleActivarModoSeleccion = () => {
    setModoSeleccion(true);
    setRepuestosSeleccionados([]);
  };

  const handleCancelarSeleccion = () => {
    setModoSeleccion(false);
    setRepuestosSeleccionados([]);
  };

  const handleEliminarRepuestosSeleccionados = async () => {
    if (!isSecretaria || !usuarioId) return;

    if (repuestosSeleccionados.length === 0) {
      toast.error('Selecciona al menos un repuesto para eliminar');
      return;
    }

    try {
      await eliminarRepuestos({
        servicio_id: servicio.servicio_id,
        repuestos_ids: repuestosSeleccionados,
        usuario_elimina_id: usuarioId
      }, {
        onSuccess: () => {
          setRepuestosSeleccionados([]);
          setModoSeleccion(false);
          refetchRepuestos();
          toast.success(`${repuestosSeleccionados.length} repuesto(s) eliminado(s)`);
        }
      });
    } catch (error) {
      console.error('Error al eliminar repuestos:', error);
    }
  };

  const handleEliminarRepuestoIndividual = async (repuesto: any, index: number) => {
    if (!isSecretaria) return;

    if (repuesto.id) {
      try {
        await eliminarRepuestos({
          servicio_id: servicio.servicio_id,
          repuestos_ids: [repuesto.id],
          usuario_elimina_id: usuarioId!
        }, {
          onSuccess: () => {
            refetchRepuestos();
            toast.success('Repuesto eliminado correctamente');
          }
        });
      } catch (error) {
        console.error('Error al eliminar repuesto:', error);
      }
    } else {
      const nuevosRepuestos = servicio.repuestos.filter((_, i) => i !== index);
      setServicio({ ...servicio, repuestos: nuevosRepuestos });
      toast.success('Repuesto eliminado localmente');
    }
  };

  const agregarRepuesto = (producto: any) => {
    if (!isSecretaria) return;

    const repuestoExistenteIndex = servicio.repuestos.findIndex(
      (r: any) => !r.id && r.producto_id === producto.id
    );

    if (repuestoExistenteIndex !== -1) {
      const nuevosRepuestos = servicio.repuestos.map((repuesto: any, index: number) =>
        index === repuestoExistenteIndex
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

  const actualizarCantidadRepuesto = (index: number, nuevaCantidad: number) => {
    if (!isSecretaria) return;
    if (nuevaCantidad < 1) return;

    const repuesto = servicio.repuestos[index];
    if (repuesto.id) {
      toast.error('No puedes modificar repuestos ya guardados');
      return;
    }

    const nuevosRepuestos = servicio.repuestos.map((repuesto: any, i: number) =>
      i === index ? { ...repuesto, cantidad: nuevaCantidad } : repuesto
    );
    setServicio({ ...servicio, repuestos: nuevosRepuestos });
  };

  const handleAgregarRepuestos = () => {
    if (!usuarioId || !isSecretaria) return;

    const repuestosNuevos = servicio.repuestos.filter(repuesto => !repuesto.id);
    if (repuestosNuevos.length === 0) {
      toast.error('No hay repuestos nuevos para guardar');
      return;
    }

    const payload = {
      servicio_id: servicio.servicio_id,
      repuestos: repuestosNuevos.map((repuesto: any) => ({
        producto_id: repuesto.producto_id,
        cantidad: Number(repuesto.cantidad),
        precio_unitario: Number(repuesto.precio_unitario)
      })),
      usuario_agrega_id: usuarioId
    };

    agregarRepuestos(payload, {
      onSuccess: () => {
        refetchRepuestos();
        toast.success('Repuestos guardados correctamente');
      }
    });
  };

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
    guardarAvance(payload, {
      onSuccess: (data) => {
        if (data.data) {
          const servicioActualizado = data.data;
          setServicio(prev => ({
            ...prev,
            diagnostico: servicioActualizado.diagnostico || prev.diagnostico,
            solucion: servicioActualizado.solucion || prev.solucion,
            precio_mano_obra: servicioActualizado.precio_mano_obra || prev.precio_mano_obra,
            estado_id: servicioActualizado.estado_id || prev.estado_id
          }));
        }

        if (data.repuestos) {
          setServicio(prev => ({
            ...prev,
            repuestos: data.repuestos
          }));
        }

        toast.success('Avance guardado correctamente');
      },
      onError: (error) => {
        console.error('Error al guardar avance:', error);
        toast.error('Error al guardar avance');
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
    finalizarReparacion(payload, {
      onSuccess: () => {
        toast.success('Reparación finalizada correctamente');
        setServicio(prev => ({
          ...prev,
          estado_id: 3
        }));
      },
      onError: (error) => {
        toast.error('Error al finalizar reparación');
      }
    });
  };

  const calcularTotales = () => {
    const totalRepuestos = servicio.repuestos.reduce((sum: number, repuesto: any) =>
      sum + (repuesto.cantidad * parseFloat(repuesto.precio_unitario)), 0
    );
    const precioTotal = servicio.precio_mano_obra + totalRepuestos;
    return { totalRepuestos, precioTotal };
  };

  const { totalRepuestos, precioTotal } = calcularTotales();
  const repuestosGuardados = servicio.repuestos.filter(r => r.id).length;
  const repuestosNuevos = servicio.repuestos.filter(r => !r.id).length;

  // ... (EL JSX SE MANTIENE EXACTAMENTE IGUAL)
  // ⚠️ COPIAR DESDE AQUÍ HACIA ABAJO TODO EL RETURN QUE YA TIENES

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* HEADER */}
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

      {/* INDICADOR */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-blue-600" />
          <span className="text-blue-700 text-sm">
            {repuestosGuardados} repuesto(s) guardados • {repuestosNuevos} repuesto(s) nuevo(s) • {repuestosSeleccionados.length} seleccionado(s) para eliminar
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECCIÓN TÉCNICO */}
        {!isSecretaria && (
          <Card>
            <CardHeader>
              <CardTitle>Completar Reparación</CardTitle>
              <CardDescription>Servicio ID: #{servicio.servicio_id}</CardDescription>
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
                <Label htmlFor="precio_mano_obra">Precio Mano de Obra (S/.)</Label>
                <Input
                  id="precio_mano_obra"
                  min={0}
                  value={servicio.precio_mano_obra}
                  onChange={(e) => setServicio({ ...servicio, precio_mano_obra: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          {/* SECCIÓN REPUESTOS */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg">Repuestos Utilizados</CardTitle>
                <CardDescription className="text-sm">
                  {servicio.repuestos.length} repuesto(s)
                  {!isSecretaria && " - Solo lectura"}
                  {modoSeleccion && " - Modo selección activado"}
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                {isSecretaria && !modoSeleccion && <BuscarRepuestos agregarRepuesto={agregarRepuesto} />}

                {isSecretaria && repuestosGuardados > 0 && (
                  <>
                    {!modoSeleccion ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleActivarModoSeleccion}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Eliminar Repuestos
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancelarSeleccion}
                        >
                          Cancelar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleEliminarRepuestosSeleccionados}
                          disabled={repuestosSeleccionados.length === 0 || isPendingEliminar}
                        >
                          {isPendingEliminar ? (
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4 mr-1" />
                          )}
                          Eliminar ({repuestosSeleccionados.length})
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
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
                  actualizarCantidadRepuesto={isSecretaria && !modoSeleccion ? actualizarCantidadRepuesto : undefined}
                  eliminarRepuesto={isSecretaria && !modoSeleccion ? handleEliminarRepuestoIndividual : undefined}
                  modoLectura={!isSecretaria}
                  mostrarAgregadoPor={!isSecretaria}
                  repuestosSeleccionados={repuestosSeleccionados}
                  onSeleccionRepuesto={handleSeleccionRepuesto}
                  modoSeleccion={modoSeleccion}
                />
              )}
            </CardContent>
          </Card>

          {/* RESUMEN DE COSTOS */}
          <ResumenCostos
            manoObra={servicio.precio_mano_obra}
            totalRepuestos={totalRepuestos}
            precioTotal={precioTotal}
          />

          {/* ✅ BOTONES MEJORADOS */}
          <div className='xl:grid-cols-2 grid gap-3 sm:grid-cols-1'>
            {isSecretaria ? (
              // ✅ BOTONES SECRETARIA MEJORADOS
              <div className="space-y-3 w-full">
                {/* BOTÓN PRINCIPAL: GUARDAR TODOS LOS CAMBIOS */}
                <Button
                  onClick={handleGuardarTodosLosCambios}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isPending || !hayCambiosPendientes()}
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
                      Guardar Todos los Cambios
                    </>
                  )}
                </Button>

                {/* BOTÓN SECUNDARIO: SOLO GUARDAR NUEVOS */}
                {repuestosNuevos > 0 && (
                  <Button
                    onClick={handleAgregarRepuestos}
                    variant="outline"
                    className="w-full"
                    disabled={isPending}
                    size="sm"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Solo Guardar Repuestos Nuevos ({repuestosNuevos})
                  </Button>
                )}

                {/* INDICADOR */}
                <div className="text-xs text-center text-gray-500">
                  {repuestosNuevos > 0 && `${repuestosNuevos} nuevo(s) `}
                  {repuestosNuevos > 0 && repuestosSeleccionados.length > 0 && "• "}
                  {repuestosSeleccionados.length > 0 && `${repuestosSeleccionados.length} por eliminar`}
                  {!hayCambiosPendientes() && "No hay cambios pendientes"}
                </div>
              </div>
            ) : (
              // BOTONES TÉCNICO (se mantienen igual)
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