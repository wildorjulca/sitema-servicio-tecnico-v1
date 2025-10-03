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
} from 'lucide-react';
import { useReportePeriodoHook } from '@/hooks/useReporte';
import { exportarReporteExcel } from './ui/exelExportacio';
import { exportarReportePDF } from './ui/pdfExport';
import { ServiciosFiltradosTable } from './ui/tableFiltre';

export const ReportesDashboard = () => {
  const [tipoPeriodo, setTipoPeriodo] = useState<'DIARIO' | 'SEMANAL' | 'MENSUAL'>('DIARIO');
  const [fechaBase, setFechaBase] = useState(new Date().toISOString().split('T')[0]);

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

          <Button
            onClick={handleExportarExcel}
            className="flex items-center gap-2 shrink-0"
            variant="outline"
          >
            <Download className="h-4 w-4" />
            Exportar Exel
          </Button>

          <Button
            onClick={handleExportarPDF}
            className="flex items-center gap-2 shrink-0"
            variant="outline"
          >
            <Download className="h-4 w-4" />
            Exportar Pdf
          </Button>
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

      {/* TABLA DE SERVICIOS - SIEMPRE VISIBLE */}
      <ServiciosFiltradosTable
        datos={detalle || []}
        periodoInicio={resumen.periodo_inicio}
        periodoFin={resumen.periodo_fin}
      />

      {/* Información del Periodo */}
      <div className="flex justify-center">
        <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg border">
          Periodo: {new Date(resumen.periodo_inicio).toLocaleDateString()} - {new Date(resumen.periodo_fin).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

// Componente de métrica principal mejorado
const MetricCard = ({
  title,
  value,
  icon,
  description,
  variant = 'default',
  trend
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
  variant?: 'default' | 'primary' | 'success' | 'secondary';
  trend?: 'up' | 'down' | 'neutral';
}) => {
  const variantClasses = {
    default: 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800',
    primary: 'border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20',
    success: 'border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-900/20',
    secondary: 'border-purple-200 bg-purple-50 dark:border-purple-700 dark:bg-purple-900/20',
  };

  const trendIcons = {
    up: '↗️',
    down: '↘️',
    neutral: '→'
  };

  return (
    <Card className={`${variantClasses[variant]} transition-all duration-200 hover:shadow-md`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${variant === 'primary' ? 'bg-blue-100 dark:bg-blue-800' :
                variant === 'success' ? 'bg-green-100 dark:bg-green-800' :
                  variant === 'secondary' ? 'bg-purple-100 dark:bg-purple-800' :
                    'bg-gray-100 dark:bg-gray-700'
              }`}>
              {icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
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