// components/DetalleProducto.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Laptop, Calendar, User, DollarSign, Code, Copy, CheckCheck, Package } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useServiceyId } from "@/hooks/useService";
import { useState } from "react";
import { toast } from "react-hot-toast";

export function DetalleService() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const usuarioId = user?.id;
  const [copied, setCopied] = useState(false);

  const { data: ServiceData, isLoading, isError } = useServiceyId(usuarioId, id);


  const copyToClipboard = () => {
    navigator.clipboard.writeText(ServiceData?.codigoSeguimiento || "");
    setCopied(true);
    toast.success("Código copiado al portapapeles");
    setTimeout(() => setCopied(false), 2000);
  };

  // Formatear fechas para mostrar
  const formatDate = (dateString: string) => {
    if (!dateString) return "No especificada";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  // Formatear moneda
  const formatCurrency = (amount: number) => {
    return `S/. ${(amount || 0).toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 max-w-7xl h-full">
        <div className="flex items-center mb-4">
          <Skeleton className="h-10 w-10 mr-2" />
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-80 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-8 w-1/3" />
            <div className="flex space-x-4 pt-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !ServiceData) {
    return (
      <div className="container mx-auto p-4 max-w-7xl h-full">
        <Button variant="outline" onClick={() => navigate("/dashboard/list")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">Servicio no encontrado</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">El servicio que buscas no existe o no tienes permisos para verlo.</p>
        </div>
      </div>
    );
  }

  const repuestos = ServiceData.repuestos || [];

  return (
    <div className="container mx-auto p-4 max-w-7xl h-full">
      <Button variant="outline" onClick={() => navigate("/dashboard/list")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver al listado
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tarjeta de información principal */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-2 dark:border-gray-700">
            <CardHeader className="pb-3 border-b dark:border-gray-700">
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl flex items-center gap-2 text-gray-800 dark:text-gray-100">
                  <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  {ServiceData?.cliente}
                </CardTitle>
                <p className="text-green-700 dark:text-green-400 font-sans font-semibold">
                  {ServiceData.estado}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Code className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
                    Código de seguimiento
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800 dark:text-gray-100">{ServiceData.codigoSeguimiento}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={copyToClipboard}
                      className="h-6 w-6 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {copied ? <CheckCheck className="h-3 w-3 text-green-500 dark:text-green-400" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <DollarSign className="h-4 w-4 mr-2 text-green-500 dark:text-green-400" />
                    Precio total
                  </div>
                  <div className="font-medium text-green-600 dark:text-green-400 text-lg">{formatCurrency(ServiceData.precioTotal)}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2 text-purple-500 dark:text-purple-400" />
                    Fecha de ingreso
                  </div>
                  <div className="text-gray-800 dark:text-gray-100">{formatDate(ServiceData.fechaIngreso)}</div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2 text-purple-500 dark:text-purple-400" />
                    Fecha de entrega
                  </div>
                  <div className="text-gray-800 dark:text-gray-100">
                    {ServiceData.fechaEntrega ? formatDate(ServiceData.fechaEntrega) : "Aún no entregado"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tarjeta de información del equipo */}
          <Card className="border-2 dark:border-gray-700">
            <CardHeader className="pb-2 border-b dark:border-gray-700">
              <CardTitle className="text-xl flex items-center gap-2 text-gray-800 dark:text-gray-100">
                <Laptop className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Información del equipo
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Tipo</div>
                  <div className="font-medium text-gray-800 dark:text-gray-100">{ServiceData.equipo}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Marca</div>
                  <div className="font-medium text-gray-800 dark:text-gray-100">{ServiceData.marca || "Sin especificar"}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Modelo</div>
                  <div className="font-medium text-gray-800 dark:text-gray-100">{ServiceData.modelo || "Sin especificar"}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Serie</div>
                  <div className="font-medium text-gray-800 dark:text-gray-100">{ServiceData.serie || "Sin especificar"}</div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="text-sm text-gray-500 dark:text-gray-400">Código de barras</div>
                <div className="font-medium text-gray-800 dark:text-gray-100">{ServiceData.codigo_barras || "No asignado"}</div>
              </div>
            </CardContent>
          </Card>

          {/* Tarjeta de repuestos utilizados - NUEVA SECCIÓN */}
          <Card className="border-2 dark:border-gray-700">
            <CardHeader className="pb-3 border-b dark:border-gray-700">
              <CardTitle className="text-xl flex items-center gap-2 text-gray-800 dark:text-gray-100">
                <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Repuestos Utilizados
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {repuestos.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 font-semibold text-sm text-gray-600 dark:text-gray-400 border-b pb-2">
                    <div>Producto</div>
                    <div className="text-center">Cantidad</div>
                    <div className="text-right">Precio Unit.</div>
                    <div className="text-right">Importe</div>
                  </div>
                  {repuestos.map((repuesto, index) => (
                    <div key={repuesto.idServicioRepuesto} className="grid grid-cols-4 gap-4 py-2 border-b dark:border-gray-700">
                      <div className="font-medium text-gray-800 dark:text-gray-100">
                        {repuesto.producto_nombre}
                      </div>
                      <div className="text-center text-gray-600 dark:text-gray-400">
                        {repuesto.cantidad}
                      </div>
                      <div className="text-right text-gray-600 dark:text-gray-400">
                        {formatCurrency(repuesto.precio_unitario)}
                      </div>
                      <div className="text-right font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(repuesto.importe)}
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-4 border-t dark:border-gray-700">
                    <span className="font-semibold text-gray-800 dark:text-gray-100">Total Repuestos:</span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(ServiceData.precioRepuestos)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No se utilizaron repuestos en este servicio</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tarjeta de detalles del servicio */}
          <Card className="border-2 dark:border-gray-700">
            <CardHeader className="pb-3 border-b dark:border-gray-700">
              <CardTitle className="text-xl text-gray-800 dark:text-gray-100">Detalles del servicio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Motivo de ingreso</div>
                  <div className="font-medium text-gray-800 dark:text-gray-100">{ServiceData.motivo_ingreso}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{ServiceData.descripcion_motivo}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Diagnóstico</div>
                  <div className="text-gray-800 dark:text-gray-100">{ServiceData.diagnostico || "Sin diagnóstico"}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Solución aplicada</div>
                  <div className="text-gray-800 dark:text-gray-100">{ServiceData.solucion || "Sin solución especificada"}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Observaciones</div>
                  <div className="text-gray-800 dark:text-gray-100">{ServiceData.observacion || "Sin observaciones"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Columna lateral */}
        <div className="space-y-4">
          {/* Tarjeta de información de precios */}
          <Card className="border-2 dark:border-gray-700">
            <CardHeader className="border-b dark:border-gray-700">
              <CardTitle className="text-lg text-gray-800 dark:text-gray-100">Detalles de costos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-4">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Mano de obra:</span>
                <span className="text-gray-800 dark:text-gray-100">{formatCurrency(ServiceData.precio)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Repuestos:</span>
                <span className="text-gray-800 dark:text-gray-100">{formatCurrency(ServiceData.precioRepuestos)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t dark:border-gray-700 font-medium">
                <span className="text-gray-800 dark:text-gray-100">Total:</span>
                <span className="text-green-600 dark:text-green-400 text-lg">{formatCurrency(ServiceData.precioTotal)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Tarjeta de información del personal */}
          <Card className="border-2 dark:border-gray-700">
            <CardHeader className="border-b dark:border-gray-700">
              <CardTitle className="text-lg text-gray-800 dark:text-gray-100">Personal asignado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <div className="space-y-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">Recibido por</div>
                <div className="font-medium text-gray-800 dark:text-gray-100">{ServiceData.usuario_recibe}</div>
              </div>

              <div className="space-y-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">Atendido por</div>
                <div className="font-medium text-gray-800 dark:text-gray-100">{ServiceData.usuario_soluciona}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}