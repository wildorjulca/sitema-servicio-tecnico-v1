// RepuestosList.tsx - Versión corregida
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface Repuesto {
  producto_id: number;
  nombre: string;
  cantidad: number;
  precio_unitario: number | string; // Acepta number o string
}

interface RepuestosListProps {
  repuestos: Repuesto[];
  actualizarCantidadRepuesto: (index: number, cantidad: number) => void;
  eliminarRepuesto: (index: number) => void;
}

const RepuestosList = ({ repuestos, actualizarCantidadRepuesto, eliminarRepuesto }: RepuestosListProps) => {
  // Función para asegurar que el precio sea un número
  const parsePrecio = (precio: number | string): number => {
    if (typeof precio === 'number') return precio;
    if (typeof precio === 'string') return parseFloat(precio) || 0;
    return 0;
  };

  // Función para formatear el precio
  const formatPrecio = (precio: number | string): string => {
    const precioNum = parsePrecio(precio);
    return precioNum.toFixed(2);
  };

  // Función para calcular el subtotal
  const calcularSubtotal = (cantidad: number, precio: number | string): number => {
    const precioNum = parsePrecio(precio);
    return cantidad * precioNum;
  };

  return (
    <div className="space-y-3">
      {repuestos.length > 0 ? (
        repuestos.map((r, index) => {
          const subtotal = calcularSubtotal(r.cantidad, r.precio_unitario);
          
          return (
            <div
              key={`${r.producto_id}-${index}`}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{r.nombre}</p>
                <p className="text-xs text-muted-foreground">
                  ${formatPrecio(r.precio_unitario)} x {r.cantidad} ={' '}
                  <span className="font-medium">
                    ${subtotal.toFixed(2)}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2">
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => eliminarRepuesto(index)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
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