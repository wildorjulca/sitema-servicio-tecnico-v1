import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { Plus, Wifi, WifiOff } from "lucide-react"
import { Link } from "react-router-dom"
import { useServicioHook } from "@/hooks/useService"
import { useUser } from "@/hooks/useUser"
import { useEffect, useMemo} from "react"
import { Skeleton } from "@/components/ui/skeleton"

// Colores para el gráfico
const COLORS = ["#3b82f6", "#facc15", "#22c55e", "#ef4444", "#8b5cf6"]

export default function Panel() {
  const { user } = useUser()
  const usuarioId = user?.id
  const { data: servicios, isLoading, isConnected } = useServicioHook(usuarioId, 0, 1000) // Traer todos los servicios

  // 🔥 ESTADÍSTICAS EN TIEMPO REAL
  const estadisticas = useMemo(() => {
    if (!servicios.length) {
      return {
        total: 0,
        enReparacion: 0,
        listosParaEntregar: 0,
        entregados: 0,
        pendientes: 0,
        entregadosHoy: 0,
        clientesNuevos: 0,
        productosBajosStock: 2 // Mock por ahora
      }
    }

    const hoy = new Date().toDateString()
    
    // Contar por estado
    const enReparacion = servicios.filter(s => s.estado_id === 2).length
    const listosParaEntregar = servicios.filter(s => s.estado_id === 3).length
    const entregados = servicios.filter(s => s.estado_id === 4).length
    const pendientes = servicios.filter(s => s.estado_id === 1).length

    // Entregados hoy
    const entregadosHoy = servicios.filter(s => {
      if (s.estado_id !== 4 || !s.fechaEntrega) return false
      const fechaEntrega = new Date(s.fechaEntrega).toDateString()
      return fechaEntrega === hoy
    }).length

    // Clientes únicos (simplificado)
    const clientesUnicos = new Set(servicios.map(s => s.cliente_id)).size

    return {
      total: servicios.length,
      enReparacion,
      listosParaEntregar,
      entregados,
      pendientes,
      entregadosHoy,
      clientesNuevos: clientesUnicos,
      productosBajosStock: 2 // Mock
    }
  }, [servicios])

  // 🔥 DATOS PARA EL GRÁFICO PIE
  const datosGrafico = useMemo(() => [
    { name: "En reparación", value: estadisticas.enReparacion },
    { name: "Listo para entregar", value: estadisticas.listosParaEntregar },
    { name: "Entregado", value: estadisticas.entregados },
    { name: "Pendiente", value: estadisticas.pendientes },
  ], [estadisticas])

  // 🔥 ÚLTIMOS 5 SERVICIOS
  const ultimosServicios = useMemo(() => {
    return servicios
      .sort((a, b) => new Date(b.fechaIngreso).getTime() - new Date(a.fechaIngreso).getTime())
      .slice(0, 5)
      .map(servicio => ({
        id: servicio.idServicio,
        cliente: servicio.cliente,
        equipo: servicio.equipo,
        estado: servicio.estado,
        fechaIngreso: new Date(servicio.fechaIngreso).toLocaleDateString('es-ES')
      }))
  }, [servicios])

  // 🔥 GRÁFICO DE BARRAS POR SEMANA (opcional)
  const datosSemanales = useMemo(() => {
    const ultimaSemana = [...Array(7)].map((_, i) => {
      const fecha = new Date()
      fecha.setDate(fecha.getDate() - i)
      return fecha.toDateString()
    }).reverse()

    return ultimaSemana.map(fecha => {
      const serviciosDia = servicios.filter(s => 
        new Date(s.fechaIngreso).toDateString() === fecha
      )
      return {
        name: new Date(fecha).toLocaleDateString('es-ES', { weekday: 'short' }),
        servicios: serviciosDia.length
      }
    })
  }, [servicios])

  // 🔥 EFECTO PARA NOTIFICACIONES DE CAMBIOS
  useEffect(() => {
    if (servicios.length > 0 && isConnected) {
      console.log("📊 Panel actualizado con", servicios.length, "servicios")
    }
  }, [servicios, isConnected])

  // Estado de carga
  if (isLoading) {
    return <PanelSkeleton />
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 🔥 INDICADOR DE ESTADO EN TIEMPO REAL */}
      <div className={`p-3 rounded-lg flex items-center justify-between ${
        isConnected ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
      }`}>
        <div className="flex items-center gap-4">
          {isConnected ? (
            <Wifi className="h-5 w-5 text-green-600" />
          ) : (
            <WifiOff className="h-5 w-5 text-yellow-600" />
          )}
          <span className={`font-medium ${
            isConnected ? 'text-green-700' : 'text-yellow-700'
          }`}>
            {isConnected ? 'Conectado en tiempo real' : ' Sin conexión en tiempo real'}
          </span>
          <span className="text-sm text-gray-600">
             {estadisticas.total} servicios cargados
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            Actualizado: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* 🔥 MÉTRICAS PRINCIPALES EN TIEMPO REAL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Servicios en curso" 
          value={estadisticas.enReparacion}
          description="Equipos en reparación activa"
          color="blue"
        />
        
        <MetricCard 
          title="Equipos entregados hoy" 
          value={estadisticas.entregadosHoy}
          description="Entregas del día de hoy"
          color="green"
        />
        
        <MetricCard 
          title="Clientes únicos" 
          value={estadisticas.clientesNuevos}
          description="Total de clientes atendidos"
          color="purple"
        />
        
        <MetricCard 
          title="Listos para entregar" 
          value={estadisticas.listosParaEntregar}
          description="Equipos reparados pendientes de entrega"
          color="yellow"
        />
      </div>

      {/* 🔥 GRÁFICOS EN TIEMPO REAL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de estado de servicios */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Estado de servicios</CardTitle>
            <Link to={'/dashboard/new'}>
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Nuevo servicio
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="h-72">
            {estadisticas.total > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={datosGrafico}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    fill="#8884d8"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {datosGrafico.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No hay datos para mostrar
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gráfico de actividad semanal */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad de la semana</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {datosSemanales.some(dia => dia.servicios > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={datosSemanales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="servicios" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No hay actividad esta semana
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 🔥 ÚLTIMOS SERVICIOS EN TIEMPO REAL */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Últimos servicios</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Total: {estadisticas.total} servicios
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {ultimosServicios.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Equipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha ingreso</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ultimosServicios.map((servicio) => (
                  <TableRow key={servicio.id}>
                    <TableCell className="font-medium">{servicio.cliente}</TableCell>
                    <TableCell>{servicio.equipo}</TableCell>
                    <TableCell>
                      <EstadoBadge estado={servicio.estado} />
                    </TableCell>
                    <TableCell>{servicio.fechaIngreso}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No hay servicios registrados
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// 🔥 COMPONENTES AUXILIARES

const MetricCard = ({ title, value, description, color }: { 
  title: string; 
  value: number; 
  description: string;
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'red';
}) => {
  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50',
    green: 'border-green-200 bg-green-50', 
    purple: 'border-purple-200 bg-purple-50',
    yellow: 'border-yellow-200 bg-yellow-50',
    red: 'border-red-200 bg-red-50'
  }

  return (
    <Card className={colorClasses[color]}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </CardContent>
    </Card>
  )
}

const EstadoBadge = ({ estado }: { estado: string }) => {
  const getColor = (estado: string) => {
    switch (estado) {
      case 'Recibido': return 'bg-blue-100 text-blue-800'
      case 'En Reparación': return 'bg-orange-100 text-orange-800'
      case 'Terminado': return 'bg-green-100 text-green-800'
      case 'Entregado': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColor(estado)}`}>
      {estado}
    </span>
  )
}

const PanelSkeleton = () => (
  <div className="flex flex-col gap-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-12" />
          </CardContent>
        </Card>
      ))}
    </div>
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-64 w-full" />
      </CardContent>
    </Card>
  </div>
)