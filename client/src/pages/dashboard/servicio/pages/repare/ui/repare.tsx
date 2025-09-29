// Repare.tsx
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Save, Loader2 } from 'lucide-react';
import BuscarRepuestos from './BuscarRepuestos';
import ResumenCostos from './ResumenCostos';
import RepuestosList from './RepuestosList';
import { useUser } from '@/hooks/useUser';
import { toast } from 'sonner';
import { useServicioReparacion2 } from '@/hooks/useService';

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

  console.log('servicioData recibido en Repare:', servicioData); // Para debug

  // Estado inicial con valores por defecto seguros
  const [servicio, setServicio] = useState(() => {
    // Usar una función inicializadora para cálculos seguros
    const servicioId = servicioData?.servicio_id || servicioData?.idServicio || 0;
    
    return {
      servicio_id: servicioId,
      diagnostico: servicioData?.diagnostico || '',
      solucion: servicioData?.solucion || '',
      precio_mano_obra: servicioData?.precio_mano_obra || 0,
      usuario_soluciona_id: usuarioId || 0,
      estado_id: servicioData?.estado_id || 2,
      repuestos: servicioData?.repuestos || []
    };
  });

  const { mutate: actualizarServicio, isPending } = useServicioReparacion2();

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

  // Resto de las funciones...
  const agregarRepuesto = (producto: any) => {
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
    const nuevosRepuestos = servicio.repuestos.filter((_, i) => i !== index);
    setServicio({ ...servicio, repuestos: nuevosRepuestos });
  };

  const actualizarCantidadRepuesto = (index: number, nuevaCantidad: number) => {
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

  const handleGuardar = () => {
    if (!usuarioId) {
      toast.error('Usuario no autenticado');
      return;
    }

    const payload = {
      servicio_id: servicio.servicio_id,
      diagnostico: servicio.diagnostico,
      solucion: servicio.solucion,
      precio_mano_obra: Number(servicio.precio_mano_obra),
      usuario_soluciona_id: usuarioId,
      estado_id: 2,
      repuestos: servicio.repuestos.map((repuesto: any) => ({
        producto_id: repuesto.producto_id,
        cantidad: Number(repuesto.cantidad),
        precio_unitario: Number(repuesto.precio_unitario)
      }))
    };

    console.log('Enviando datos del paso 2:', payload);
    actualizarServicio(payload);
  };

  const { totalRepuestos, precioTotal } = calcularTotales();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Completar Reparación - Paso 2</h1>
        <div className="flex items-center gap-4">
          <Badge variant={servicio.estado_id === 2 ? "secondary" : "default"}>
            {servicio.estado_id === 2 ? "En Reparación" : "Reparado"}
          </Badge>
          <span className="text-sm text-gray-500">ID: #{servicio.servicio_id}</span>
        </div>
      </div>

      {/* Resto del JSX... */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                onChange={(e) => setServicio({...servicio, diagnostico: e.target.value})}
                placeholder="Ingrese el diagnóstico..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="solucion">Solución Aplicada *</Label>
              <Textarea
                id="solucion"
                value={servicio.solucion}
                onChange={(e) => setServicio({...servicio, solucion: e.target.value})}
                placeholder="Describa la solución..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="precio_mano_obra">Precio Mano de Obra ($)</Label>
              <Input
                id="precio_mano_obra"
                type="number"
                step="0.01"
                value={servicio.precio_mano_obra}
                onChange={(e) => setServicio({...servicio, precio_mano_obra: parseFloat(e.target.value) || 0})}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg">Repuestos Utilizados</CardTitle>
                <CardDescription className="text-sm">
                  {servicio.repuestos.length} repuesto(s)
                </CardDescription>
              </div>
              <BuscarRepuestos agregarRepuesto={agregarRepuesto} />
            </CardHeader>
            <CardContent className="pt-0">
              <RepuestosList 
                repuestos={servicio.repuestos}
                actualizarCantidadRepuesto={actualizarCantidadRepuesto}
                eliminarRepuesto={eliminarRepuesto}
              />
            </CardContent>
          </Card>

          <ResumenCostos 
            manoObra={servicio.precio_mano_obra}
            totalRepuestos={totalRepuestos}
            precioTotal={precioTotal}
          />

          <Button 
            onClick={handleGuardar} 
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
                <Save className="w-4 h-4 mr-2" />
                Completar Reparación
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Repare;