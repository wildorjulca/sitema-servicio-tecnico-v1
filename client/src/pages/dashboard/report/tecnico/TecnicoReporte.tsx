import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useEstadisticasTecnicoHook, useServiciosPorTecnicoHook, useTecnicosHook } from '@/hooks/useTecnico';

export default function TecnicoReporte() {
  const [tecnicoId, setTecnicoId] = useState<string>("0");
  const [estadoId, setEstadoId] = useState<string>("");
  const [fechaDesde, setFechaDesde] = useState<string>('');
  const [fechaHasta, setFechaHasta] = useState<string>('');

  // Usar los hooks
  const { data: tecnicos, isLoading: loadingTecnicos } = useTecnicosHook();
  
  const { data: servicios, isLoading: loadingServicios, total: totalServicios } = useServiciosPorTecnicoHook({
    tecnico_id: Number(tecnicoId),
    estado_id: estadoId ? Number(estadoId) : null,
    fecha_desde: fechaDesde || null,
    fecha_hasta: fechaHasta || null
  });

  const { data: estadisticas, isLoading: loadingEstadisticas } = useEstadisticasTecnicoHook({
    tecnico_id: Number(tecnicoId),
    fecha_desde: fechaDesde || null,
    fecha_hasta: fechaHasta || null
  });

  const limpiarFiltros = () => {
    setTecnicoId("0");
    setEstadoId("");
    setFechaDesde('');
    setFechaHasta('');
  };

  const isLoading = loadingTecnicos || loadingServicios || loadingEstadisticas;

  const getBadgeVariant = (estadoId: number) => {
    switch (estadoId) {
      case 4: return "default"; // Entregado
      case 3: return "secondary"; // Terminado
      case 2: return "outline"; // En Reparación
      case 1: return "destructive"; // Pendiente
      default: return "outline";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Reporte de Servicios por Técnico</h1>
        <p className="text-muted-foreground">
          Visualiza y filtra los servicios realizados por cada técnico
        </p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Selector de Técnico */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Técnico</label>
              <Select value={tecnicoId} onValueChange={setTecnicoId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar técnico" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Seleccionar técnico</SelectItem>
                  {tecnicos?.map((tecnico) => (
                    <SelectItem key={tecnico.id} value={tecnico.id.toString()}>
                      {tecnico.nombre} {tecnico.apellidos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por Estado */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <Select value={estadoId} onValueChange={setEstadoId}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="1">Pendiente</SelectItem>
                  <SelectItem value="2">En Reparación</SelectItem>
                  <SelectItem value="3">Terminado</SelectItem>
                  <SelectItem value="4">Entregado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Fecha Desde */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha Desde</label>
              <Input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
              />
            </div>

            {/* Fecha Hasta */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha Hasta</label>
              <Input
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
              />
            </div>
          </div>

          {/* Botón Limpiar */}
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={limpiarFiltros}>
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-20 rounded-lg" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estadísticas */}
      {!isLoading && estadisticas && tecnicoId !== "0" && (
        <Card>
          <CardHeader>
            <CardTitle>Estadísticas del Técnico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-primary">{estadisticas.total_servicios}</div>
                  <p className="text-sm text-muted-foreground">Total Servicios</p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-green-600">
                    ${estadisticas.ingresos_totales?.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Ingresos Totales</p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-orange-600">
                    {estadisticas.porcentaje_entregados}%
                  </div>
                  <p className="text-sm text-muted-foreground">Tasa de Entrega</p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-purple-600">
                    {typeof estadisticas.dias_promedio_reparacion === 'number' 
                      ? estadisticas.dias_promedio_reparacion.toFixed(1) 
                      : '0'}
                  </div>
                  <p className="text-sm text-muted-foreground">Días Promedio</p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-red-600">{estadisticas.pendientes}</div>
                  <p className="text-sm text-muted-foreground">Pendientes</p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-blue-600">{estadisticas.clientes_unicos}</div>
                  <p className="text-sm text-muted-foreground">Clientes Únicos</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Servicios */}
      {!isLoading && tecnicoId !== "0" && (
        <Card>
          <CardHeader>
            <CardTitle>
              Servicios del Técnico 
              {totalServicios > 0 && ` (${totalServicios})`}
            </CardTitle>
            <CardDescription>
              Lista detallada de servicios realizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {servicios && servicios.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Equipo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Fecha Ingreso</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {servicios.map((servicio) => (
                    <TableRow key={servicio.idServicio}>
                      <TableCell className="font-medium">{servicio.codigoSeguimiento}</TableCell>
                      <TableCell>{servicio.cliente}</TableCell>
                      <TableCell>
                        {servicio.equipo} {servicio.marca} {servicio.modelo}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getBadgeVariant(servicio.estado_id)}>
                          {servicio.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        ${servicio.precioTotal?.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {new Date(servicio.fechaIngreso).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <div className="text-muted-foreground">
                  {tecnicoId !== "0" 
                    ? 'No se encontraron servicios para el técnico seleccionado' 
                    : 'Seleccione un técnico para ver los servicios'
                  }
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Estado inicial */}
      {!isLoading && tecnicoId === "0" && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">👨‍💼</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Seleccione un técnico</h3>
              <p className="text-muted-foreground">
                Elija un técnico de la lista para ver sus servicios y estadísticas
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}