// components/AlertasPanel.tsx
import { useAlertasInventarioHook } from '@/hooks/useReporte';
import { AlertTriangle, AlertCircle, Package, Info, X, Bell } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';
import { cn } from '@/lib/utils';


export const AlertasPanel = () => {
  const { data: alertas, isLoading, isError } = useAlertasInventarioHook();
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  const handleDismiss = (alertId: string) => {
    setDismissedAlerts(prev => new Set(prev).add(alertId));
  };

  if (isLoading) {
    return (
      <Card className="border-l-4 border-l-amber-500">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-muted rounded-full animate-pulse"></div>
            <div className="h-6 bg-muted rounded w-32 animate-pulse"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="h-4 w-4 bg-muted rounded-full animate-pulse"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-muted rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !alertas?.length) {
    return null;
  }

  const activeAlerts = alertas.filter(alerta => !dismissedAlerts.has(`${alerta.id}-${alerta.tipo_alerta}`));

  if (activeAlerts.length === 0) {
    return null;
  }

  const getAlertConfig = (severidad: string) => {
    switch (severidad) {
      case 'error':
        return {
          icon: AlertCircle,
          badgeVariant: 'destructive' as const,
          borderColor: 'border-l-red-500',
          bgColor: 'bg-red-50/50 dark:bg-red-950/20',
          textColor: 'text-red-900 dark:text-red-100',
          iconColor: 'text-red-600 dark:text-red-400'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          badgeVariant: 'secondary' as const,
          borderColor: 'border-l-amber-500',
          bgColor: 'bg-amber-50/50 dark:bg-amber-950/20',
          textColor: 'text-amber-900 dark:text-amber-100',
          iconColor: 'text-amber-600 dark:text-amber-400'
        };
      case 'info':
        return {
          icon: Info,
          badgeVariant: 'default' as const,
          borderColor: 'border-l-blue-500',
          bgColor: 'bg-blue-50/50 dark:bg-blue-950/20',
          textColor: 'text-blue-900 dark:text-blue-100',
          iconColor: 'text-blue-600 dark:text-blue-400'
        };
      default:
        return {
          icon: Package,
          badgeVariant: 'outline' as const,
          borderColor: 'border-l-gray-500',
          bgColor: 'bg-gray-50/50 dark:bg-gray-950/20',
          textColor: 'text-gray-900 dark:text-gray-100',
          iconColor: 'text-gray-600 dark:text-gray-400'
        };
    }
  };

  const getSeverityCounts = () => {
    const counts = { error: 0, warning: 0, info: 0, other: 0 };
    activeAlerts.forEach(alerta => {
      if (alerta.severidad in counts) {
        counts[alerta.severidad as keyof typeof counts]++;
      } else {
        counts.other++;
      }
    });
    return counts;
  };

  const severityCounts = getSeverityCounts();

  return (
    <Card className={cn(
      "border-l-4 transition-all duration-300",
      severityCounts.error > 0 ? "border-l-red-500" :
        severityCounts.warning > 0 ? "border-l-amber-500" :
          "border-l-blue-500"
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
      
              
         

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-lg font-semibold truncate">
                  Alertas de Inventario
                </CardTitle>
                {/* <Badge
                  variant={severityCounts.error > 0 ? "destructive" : "secondary"}
                  className="flex-shrink-0"
                >
                  {activeAlerts.length}
                </Badge> */}
              </div>
            </div>
          </div>

          {/* Contadores de severidad - Versión compacta */}
          {activeAlerts.length > 0 && (
            <div className="flex flex-col gap-1 flex-shrink-0">
              <div className="flex gap-1 justify-end">
                {severityCounts.error > 0 && (
                  <div className="flex items-center gap-1 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md border border-red-200 dark:border-red-800">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-xs font-medium text-red-700 dark:text-red-300">
                      {severityCounts.error}
                    </span>
                  </div>
                )}
                {severityCounts.warning > 0 && (
                  <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-md border border-amber-200 dark:border-amber-800">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                      {severityCounts.warning}
                    </span>
                  </div>
                )}
                {severityCounts.info > 0 && (
                  <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md border border-blue-200 dark:border-blue-800">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                      {severityCounts.info}
                    </span>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-3">
            {activeAlerts.map((alerta) => {
              const config = getAlertConfig(alerta.severidad);
              const IconComponent = config.icon;

              return (
                <div
                  key={`${alerta.id}-${alerta.tipo_alerta}`}
                  className={cn(
                    "p-4 rounded-lg border transition-all duration-200 group hover:shadow-md relative",
                    config.bgColor,
                    config.borderColor
                  )}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDismiss(`${alerta.id}-${alerta.tipo_alerta}`)}
                  >
                    <X className="h-3 w-3" />
                  </Button>

                  <div className="flex items-start gap-3 pr-6">
                    <div className={cn("p-2 rounded-full", config.bgColor)}>
                      <IconComponent className={cn("h-4 w-4", config.iconColor)} />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={cn("font-semibold text-sm", config.textColor)}>
                          {alerta.nombre}
                        </h4>
                        <Badge variant={config.badgeVariant} className="text-xs capitalize">
                          {alerta.tipo_alerta.replace(/_/g, ' ')}
                        </Badge>
                      </div>

                      <p className={cn("text-sm leading-relaxed", config.textColor)}>
                        {alerta.mensaje}
                      </p>

                      <div className="flex gap-4 text-xs opacity-80 pt-1">
                        <div className="flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          <span className={config.textColor}>
                            Actual: <strong>{alerta.stock_actual}</strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          <span className={config.textColor}>
                            Mínimo: <strong>{alerta.stock_minimo}</strong>
                          </span>
                        </div>
                        {alerta.stock_actual > 0 && (
                          <div className="flex items-center gap-1">
                            <Info className="h-3 w-3" />
                            <span className={config.textColor}>
                              Diferencia: <strong>{alerta.stock_actual - alerta.stock_minimo}</strong>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {activeAlerts.length > 3 && (
          <div className="mt-4 pt-3 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Mostrando {activeAlerts.length} alertas • Desliza para ver más
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};