// components/RepuestosList.tsx
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';

interface Repuesto {
  id?: number;
  producto_id: number;
  nombre: string;
  cantidad: number;
  precio_unitario: number | string;
}

interface RepuestosListProps {
  repuestos: Repuesto[];
  actualizarCantidadRepuesto?: (index: number, cantidad: number) => void;
  eliminarRepuesto?: (repuesto: Repuesto, index: number) => void; // ✅ CAMBIADO: recibe el repuesto completo
  modoLectura?: boolean;
  mostrarAgregadoPor?: boolean;
  repuestosSeleccionados?: number[];
  onSeleccionRepuesto?: (repuestoId: number, seleccionado: boolean) => void;
  modoSeleccion?: boolean;
}

const RepuestosList = ({ 
  repuestos, 
  actualizarCantidadRepuesto, 
  eliminarRepuesto,
  modoLectura = false,
  repuestosSeleccionados = [],
  onSeleccionRepuesto,
  modoSeleccion = false
}: RepuestosListProps) => {

  const parsePrecio = (precio: number | string): number => {
    if (typeof precio === 'number') return precio;
    if (typeof precio === 'string') return parseFloat(precio) || 0;
    return 0;
  };

  const formatPrecio = (precio: number | string): string => {
    const precioNum = parsePrecio(precio);
    return precioNum.toFixed(2);
  };

  const calcularSubtotal = (cantidad: number, precio: number | string): number => {
    const precioNum = parsePrecio(precio);
    return cantidad * precioNum;
  };

  const handleSeleccionChange = (repuestoId: number, seleccionado: boolean) => {
    onSeleccionRepuesto?.(repuestoId, seleccionado);
  };

  // ✅ FUNCIÓN PARA ELIMINAR - AHORA RECIBE EL REPUESTO COMPLETO
  const handleEliminarClick = (repuesto: Repuesto, index: number) => {
    if (eliminarRepuesto) {
      eliminarRepuesto(repuesto, index);
    }
  };

  return (
    <div className="space-y-3">
      {repuestos.length > 0 ? (
        repuestos.map((r, index) => {
          const subtotal = calcularSubtotal(r.cantidad, r.precio_unitario);
          const estaSeleccionado = repuestosSeleccionados.includes(r.id || -1);
          
          return (
            <div
              key={r.id ? `db-${r.id}` : `local-${r.producto_id}-${index}`}
              className={`flex items-center justify-between p-3 border rounded-lg ${
                estaSeleccionado ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              {modoSeleccion && r.id && (
                <div className="mr-3">
                  <Checkbox
                    checked={estaSeleccionado}
                    onCheckedChange={(checked) => 
                      handleSeleccionChange(r.id!, checked as boolean)
                    }
                  />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{r.nombre}</p>
                <p className="text-xs text-muted-foreground">
                  ${formatPrecio(r.precio_unitario)} x {r.cantidad} ={' '}
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                  {r.id && (
                    <span className="ml-2 text-gray-400">ID: {r.id}</span>
                  )}
                  {!r.id && (
                    <span className="ml-2 text-orange-400">(No guardado)</span>
                  )}
                </p>
              </div>
              
              {/* ✅ BOTONES DE ACCIÓN - SOLO CUANDO NO ESTÁ EN MODO SELECCIÓN */}
              {!modoLectura && !modoSeleccion && (
                <div className="flex items-center gap-2">
                  {/* BOTONES DE CANTIDAD SOLO PARA REPUESTOS NO GUARDADOS */}
                  {!r.id && actualizarCantidadRepuesto && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => actualizarCantidadRepuesto(index, r.cantidad - 1)}
                        disabled={r.cantidad <= 1}
                      >
                        -
                      </Button>
                      <span className="text-sm w-6 text-center">{r.cantidad}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => actualizarCantidadRepuesto(index, r.cantidad + 1)}
                      >
                        +
                      </Button>
                    </>
                  )}
                  
                  {/* BOTÓN ELIMINAR - PARA TODOS LOS REPUESTOS */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleEliminarClick(r, index)} // ✅ PASAMOS EL REPUESTO COMPLETO
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="text-center py-6 text-muted-foreground">
          <p className="text-sm">No hay repuestos agregados</p>
        </div>
      )}
    </div>
  );
};

export default RepuestosList;