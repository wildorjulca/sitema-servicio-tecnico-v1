// components/ServiciosFiltradosTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Package, Monitor, Wrench } from "lucide-react";

interface Repuesto {
  idServicioRepuesto: number;
  producto_id: number;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: number;
  importe: number;
}

interface ServicioDetallado {
  idServicio: number;
  codigoSeguimiento: string;
  fechaIngreso: string;
  motivo_ingreso_id: number;
  motivo_ingreso: string;
  descripcion_motivo: string;
  observacion: string;
  diagnostico: string;
  solucion: string;
  precio: number;
  usuario_recibe_id: number;
  usuario_recibe: string;
  usuario_soluciona_id: number;
  usuario_soluciona: string;
  fechaEntrega: string | null;
  precioRepuestos: number;
  estado_id: number;
  estado: string;
  precioTotal: number;
  servicio_equipos_id: number;
  equipo: string;
  MARCA_idMarca: number;
  marca: string;
  modelo: string;
  serie: string;
  codigo_barras: string;
  cliente_id: number;
  cliente: string;
  repuestos: Repuesto[] | null;
}

interface ServiciosFiltradosTableProps {
  datos: ServicioDetallado[];
  periodoInicio: string;
  periodoFin: string;
}

export const ServiciosFiltradosTable = ({ 
  datos, 
  periodoInicio, 
  periodoFin 
}: ServiciosFiltradosTableProps) => {
  // VALIDACIÓN ROBUSTA - Manejar todos los casos posibles
  if (!datos || !Array.isArray(datos) || datos.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500 dark:text-gray-400">
            No hay servicios para mostrar en el periodo seleccionado
          </div>
        </CardContent>
      </Card>
    );
  }

  // Formatear fecha con manejo de errores
  const formatearFecha = (fecha: string | null) => {
    try {
      if (!fecha) return '-';
      return new Date(fecha).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return '-';
    }
  };

  // Función para obtener el color del estado
  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'en reparación':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'terminado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'entregado':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Calcular totales
  const totales = {
    servicios: datos.length,
    ingresos: datos.reduce((sum, item) => sum + (Number(item.precioTotal) || 0), 0),
    manoObra: datos.reduce((sum, item) => sum + (Number(item.precio) || 0), 0),
    repuestos: datos.reduce((sum, item) => sum + (Number(item.precioRepuestos) || 0), 0),
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Package className="h-5 w-5" />
          Servicios Detallados
          <Badge variant="secondary" className="ml-2">
            {datos.length} servicios
          </Badge>
        </CardTitle>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span>Periodo: {formatearFecha(periodoInicio)} - {formatearFecha(periodoFin)}</span>
          <span className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            Total: S/ {totales.ingresos.toFixed(2)}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Código</TableHead>
              <TableHead className="w-[100px]">Fecha</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Equipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Mano Obra</TableHead>
              <TableHead className="text-right">Repuestos</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Técnico</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {datos.map((servicio, index) => {
              const precio = Number(servicio.precio) || 0;
              const precioRepuestos = Number(servicio.precioRepuestos) || 0;
              const precioTotal = Number(servicio.precioTotal) || 0;

              return (
                <TableRow key={servicio.idServicio} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <TableCell className="font-mono font-bold">
                    {servicio.codigoSeguimiento}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatearFecha(servicio.fechaIngreso)}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[150px]">
                      <div className="font-medium truncate" title={servicio.cliente}>
                        {servicio.cliente}
                      </div>
                      <div className="text-xs text-gray-500 truncate" title={servicio.descripcion_motivo}>
                        {servicio.motivo_ingreso}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[120px]">
                      <div className="flex items-center gap-1 text-sm">
                        <Monitor className="h-3 w-3" />
                        <span className="truncate" title={servicio.equipo}>
                          {servicio.equipo}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 truncate" title={`${servicio.marca} ${servicio.modelo}`}>
                        {servicio.marca} {servicio.modelo}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`text-xs font-medium ${getEstadoColor(servicio.estado)}`}
                    >
                      {servicio.estado}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    S/ {precio.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {precioRepuestos > 0 ? (
                      <span className="text-orange-600">S/ {precioRepuestos.toFixed(2)}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-bold text-green-600">
                    S/ {precioTotal.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Wrench className="h-3 w-3 text-gray-500" />
                      <span className="truncate max-w-[100px]" title={servicio.usuario_soluciona}>
                        {servicio.usuario_soluciona || 'Sin asignar'}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            
            {/* Fila de totales */}
            <TableRow className="bg-gray-50 dark:bg-gray-800 font-semibold">
              <TableCell colSpan={5} className="font-bold text-right">
                TOTALES:
              </TableCell>
              <TableCell className="text-right font-bold">
                S/ {totales.manoObra.toFixed(2)}
              </TableCell>
              <TableCell className="text-right font-bold text-orange-600">
                S/ {totales.repuestos.toFixed(2)}
              </TableCell>
              <TableCell className="text-right font-bold text-green-600">
                S/ {totales.ingresos.toFixed(2)}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};