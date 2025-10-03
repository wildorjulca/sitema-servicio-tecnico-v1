// components/ReportesDashboard.tsx
import { useState } from 'react';
import { 
  Card, 
  CardContent,
  CardHeader, 
} from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Download, 
  BarChart3, 
  Users, 
  Package,
  DollarSign,
  Mail,
  Calendar,
  Wrench,
  TrendingUp
} from 'lucide-react';
import { useReportePeriodoHook } from '@/hooks/useReporte';
import { ServiciosFiltradosTable } from './ui/tableFiltre';
import { exportarReporteExcel } from './ui/exelExportacio';
import { exportarReportePDF, generarPDFBlob } from './ui/pdfExport';
import { EmailModal } from './ui/EmailModal';

export const ReportesDashboard = () => {
  const [tipoPeriodo, setTipoPeriodo] = useState<'DIARIO' | 'SEMANAL' | 'MENSUAL'>('DIARIO');
  const [fechaBase, setFechaBase] = useState(new Date().toISOString().split('T')[0]);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  
  const { data: reporte, isLoading } = useReportePeriodoHook(tipoPeriodo, fechaBase);

  const handleExportarExcel = () => {
    if (!reporte) {
      console.error('No hay datos para exportar');
      return;
    }
    const datosExportacion = {
      resumen: reporte.resumen,
      detalle: reporte.detalle || [],
      tipoPeriodo,
      fechaBase
    };
    exportarReporteExcel(datosExportacion);
  };

  const handleExportarPDF = async () => {
    if (!reporte) {
      console.error('No hay datos para exportar');
      return;
    }
    const datosExportacion = {
      resumen: reporte.resumen,
      detalle: reporte.detalle || [],
      tipoPeriodo,
      fechaBase
    };
    await exportarReportePDF(datosExportacion);
  };

  const handleEnviarPorEmail = async () => {
    if (!reporte) {
      alert('❌ No hay datos para enviar');
      return;
    }

    try {
      const datosExportacion = {
        resumen: reporte.resumen,
        detalle: reporte.detalle || [],
        tipoPeriodo,
        fechaBase
      };

      // Generar PDF en memoria como Blob
      const blob = await generarPDFBlob(datosExportacion);
      setPdfBlob(blob);
      setIsEmailModalOpen(true);
      
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('❌ Error al generar el PDF para enviar');
    }
  };

  if (isLoading) {
    return <ReportesDashboardSkeleton />;
  }

  const { resumen, detalle } = reporte;

  return (
    <div className="space-y-6 p-4">
      {/* Header y Controles */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reportes de Servicios
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Análisis y métricas de los servicios técnicos
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex gap-3 items-center">
            <Select 
              value={tipoPeriodo} 
              onValueChange={(value: 'DIARIO' | 'SEMANAL' | 'MENSUAL') => setTipoPeriodo(value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Periodo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DIARIO">Diario</SelectItem>
                <SelectItem value="SEMANAL">Semanal</SelectItem>
                <SelectItem value="MENSUAL">Mensual</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              type="date"
              value={fechaBase}
              onChange={(e) => setFechaBase(e.target.value)}
              className="w-40"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleExportarExcel}
              className="flex items-center gap-2"
              variant="outline"
              disabled={!reporte}
            >
              <Download className="h-4 w-4" />
              Excel
            </Button>
            <Button 
              onClick={handleExportarPDF}
              className="flex items-center gap-2"
              variant="outline"
              disabled={!reporte}
            >
              <Download className="h-4 w-4" />
              PDF
            </Button>
            <Button 
              onClick={handleEnviarPorEmail}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
              disabled={!reporte}
            >
              <Mail className="h-4 w-4" />
              Enviar Email
            </Button>
          </div>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard 
          title="Total Servicios" 
          value={resumen.total_servicios || 0}
          icon={<BarChart3 className="h-4 w-4" />}
          description="En el periodo"
          trend="up"
        />
        <MetricCard 
          title="Clientes Únicos" 
          value={resumen.clientes_unicos || 0}
          icon={<Users className="h-4 w-4" />}
          description="Clientes atendidos"
          trend="neutral"
          variant="success"
        />
        <MetricCard 
          title="Ingresos" 
          value={`S/ ${(resumen.ingresos_totales || 0).toLocaleString()}`}
          icon={<DollarSign className="h-4 w-4" />}
          description="Ingresos totales"
          trend="up"
          variant="primary"
        />
        <MetricCard 
          title="Repuestos" 
          value={resumen.repuestos_utilizados || 0}
          icon={<Package className="h-4 w-4" />}
          description="Unidades usadas"
          trend="down"
          variant="secondary"
        />
      </div>

      {/* Métricas Secundarias */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard 
          title="Técnicos Activos" 
          value={resumen.tecnicos_activos || 0}
          icon={<Wrench className="h-4 w-4" />}
          description="Técnicos trabajando"
          trend="neutral"
          variant="default"
          size="small"
        />
        <MetricCard 
          title="Días Promedio" 
          value={parseFloat(resumen.dias_promedio || '0').toFixed(1)}
          icon={<Calendar className="h-4 w-4" />}
          description="Tiempo reparación"
          trend="down"
          variant="default"
          size="small"
        />
        <MetricCard 
          title="Eficiencia" 
          value={`${resumen.porcentaje_entregados || '0'}%`}
          icon={<TrendingUp className="h-4 w-4" />}
          description="Servicios entregados"
          trend="up"
          variant="default"
          size="small"
        />
        <MetricCard 
          title="Tipos Equipo" 
          value={resumen.tipos_equipo_diferentes || 0}
          icon={<Package className="h-4 w-4" />}
          description="Equipos diferentes"
          trend="neutral"
          variant="default"
          size="small"
        />
      </div>

      {/* TABLA DE SERVICIOS - SIEMPRE VISIBLE */}
      <ServiciosFiltradosTable 
        datos={detalle || []}
        periodoInicio={resumen.periodo_inicio}
        periodoFin={resumen.periodo_fin}
      />

      {/* Información del Periodo */}
      <div className="flex justify-center">
        <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg border">
          <span className="font-semibold">Periodo:</span> {new Date(resumen.periodo_inicio).toLocaleDateString()} - {new Date(resumen.periodo_fin).toLocaleDateString()}
          <span className="mx-2">•</span>
          <span className="font-semibold">Generado:</span> {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Modal de Email */}
      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        tipoPeriodo={tipoPeriodo}
        fechaBase={fechaBase}
        pdfBlob={pdfBlob}
      />
    </div>
  );
};

// Componente de métrica principal mejorado
interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
  variant?: 'default' | 'primary' | 'success' | 'secondary';
  trend?: 'up' | 'down' | 'neutral';
  size?: 'normal' | 'small';
}

const MetricCard = ({ 
  title, 
  value, 
  icon, 
  description, 
  variant = 'default',
  trend,
  size = 'normal'
}: MetricCardProps) => {
  const variantClasses = {
    default: 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800',
    primary: 'border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20',
    success: 'border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-900/20',
    secondary: 'border-purple-200 bg-purple-50 dark:border-purple-700 dark:bg-purple-900/20',
  };

  const iconClasses = {
    default: 'bg-gray-100 dark:bg-gray-700',
    primary: 'bg-blue-100 dark:bg-blue-800',
    success: 'bg-green-100 dark:bg-green-800',
    secondary: 'bg-purple-100 dark:bg-purple-800',
  };

  const trendIcons = {
    up: '↗️',
    down: '↘️',
    neutral: '→'
  };

  const sizeClasses = {
    normal: 'p-4',
    small: 'p-3'
  };

  const textSizeClasses = {
    normal: 'text-2xl',
    small: 'text-xl'
  };

  return (
    <Card className={`${variantClasses[variant]} ${sizeClasses[size]} transition-all duration-200 hover:shadow-md`}>
      <CardContent className="p-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${iconClasses[variant]}`}>
              {icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {title}
              </p>
              <p className={`${textSizeClasses[size]} font-bold text-gray-900 dark:text-white`}>
                {value}
              </p>
            </div>
          </div>
          {trend && (
            <span className="text-lg">{trendIcons[trend]}</span>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

// Skeleton mejorado
const ReportesDashboardSkeleton = () => (
  <div className="space-y-6 p-4">
    {/* Header Skeleton */}
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="space-y-2">
        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse"></div>
      </div>
      <div className="flex gap-3">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-40 animate-pulse"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
      </div>
    </div>

    {/* Métricas principales skeleton */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="space-y-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
                </div>
              </div>
              <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse mt-2"></div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Métricas secundarias skeleton */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="space-y-1">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-8 animate-pulse"></div>
                </div>
              </div>
              <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse mt-2"></div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Tabla skeleton */}
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="pb-3">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse mt-2"></div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </CardContent>
    </Card>
  </div>
);