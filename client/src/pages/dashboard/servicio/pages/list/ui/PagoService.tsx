// components/PagoService.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, Printer, DollarSign, CheckCircle, User, Laptop, Calendar, Package, Ban } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePagarServicio, useServiceyId } from "@/hooks/useService";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BoletaTicketera } from "./BoletaTicketera";

export function PagoService() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const usuarioId = user?.id;
  const [mostrarBoleta, setMostrarBoleta] = useState(false);
  
  const { mutate: pagarServicio, isPending: isProcessing } = usePagarServicio();
  const { data: ServiceData, isLoading } = useServiceyId(usuarioId, id);

  const estaPagado = ServiceData?.Estado_pago === 0;

  const handlePagar = async (imprimir: boolean = false) => {
    if (!ServiceData || !usuarioId) return;

    if (ServiceData.estado_id !== 3) {
      toast.error("Solo se pueden pagar servicios en estado 'Terminado'");
      return;
    }

    if (estaPagado) {
      toast.error("Este servicio ya ha sido pagado");
      return;
    }

    pagarServicio(
      {
        servicio_id: ServiceData.idServicio,
        usuario_recibe_pago_id: usuarioId
      },
      {
        onSuccess: () => {
          toast.success("Pago procesado exitosamente");
          
          if (imprimir) {
            setMostrarBoleta(true);
          } else {
            setTimeout(() => {
              navigate("/dashboard/list");
            }, 1000);
          }
        }
      }
    );
  };

  const handleCerrarBoleta = () => {
    setMostrarBoleta(false);
    navigate("/dashboard/list");
  };

  const formatCurrency = (amount: number) => {
    return `S/. ${(amount || 0).toFixed(2)}`;
  };

  if (mostrarBoleta && id) {
    return <BoletaTicketera servicioId={id} onClose={handleCerrarBoleta} />;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <Button variant="outline" onClick={() => navigate("/dashboard/list")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver al listado
        </Button>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando información del servicio...</p>
        </div>
      </div>
    );
  }

  if (!ServiceData) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
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

  if (ServiceData.estado_id !== 3) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <Button variant="outline" onClick={() => navigate("/dashboard/list")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver al listado
        </Button>

        <Card className="border-2 border-yellow-200 dark:border-yellow-600">
          <CardHeader>
            <CardTitle className="text-yellow-600 dark:text-yellow-400 flex items-center gap-2">
              <CreditCard className="h-6 w-6" />
              Servicio No Disponible para Pago
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-center py-6">
              <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CreditCard className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                El servicio no está listo para pago
              </h3>
              <p className="text-yellow-600 dark:text-yellow-400 mb-4">
                Estado actual: <span className="font-bold">{ServiceData.estado}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Solo se pueden procesar pagos para servicios en estado "Terminado".
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (estaPagado) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <Button variant="outline" onClick={() => navigate("/dashboard/list")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver al listado
        </Button>

        <Card className="border-2 border-green-200 dark:border-green-600">
          <CardHeader>
            <CardTitle className="text-green-600 dark:text-green-400 flex items-center gap-2">
              <CheckCircle className="h-6 w-6" />
              Servicio Ya Pagado
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-center py-6">
              <div className="bg-green-100 dark:bg-green-900 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">
                Este servicio ya ha sido pagado
              </h3>
              <p className="text-green-600 dark:text-green-400 mb-4">
                Estado de pago: <span className="font-bold">Pagado</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                No es necesario realizar otro pago. Puedes generar una boleta si el cliente lo solicita.
              </p>
              
              <Button 
                onClick={() => setMostrarBoleta(true)}
                variant="outline" 
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Printer className="mr-2 h-4 w-4" />
                Generar Boleta
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalRepuestos = ServiceData.repuestos?.reduce((sum, rep) => sum + (rep.importe || 0), 0) || 0;
  const totalMotivos = ServiceData.motivos?.reduce((sum, mot) => sum + (mot.precio_motivo || 0), 0) || 0;
  const manoObra = ServiceData.precio || 0;

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tarjeta de información del servicio */}
          <Card className="border-2 dark:border-gray-700 dark:bg-gray-800">
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Información del cliente */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                      <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-gray-600 dark:text-gray-400">Cliente</h3>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">{ServiceData.cliente}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                      <Laptop className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-gray-600 dark:text-gray-400">Equipo</h3>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">{ServiceData.equipo}</p>
                    </div>
                  </div>
                </div>

                {/* Detalles del equipo */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Marca:</span>
                      <p className="font-medium text-gray-800 dark:text-gray-200">{ServiceData.marca || "No especificado"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Modelo:</span>
                      <p className="font-medium text-gray-800 dark:text-gray-200">{ServiceData.modelo || "No especificado"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Serie:</span>
                      <p className="font-medium text-gray-800 dark:text-gray-200">{ServiceData.serie || "No especificado"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Estado:</span>
                      <p className="font-medium text-green-600 dark:text-green-400">{ServiceData.estado}</p>
                    </div>
                  </div>
                </div>

                {/* Fechas importantes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
                      <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">Fecha de Ingreso</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {new Date(ServiceData.fechaIngreso).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-full">
                      <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">Fecha Actual</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {new Date().toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tarjeta de detalle de costos */}
          <Card className="border-2 dark:border-gray-700 dark:bg-gray-800">
            <CardHeader className="border-b dark:border-gray-700">
              <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                Detalle de Costos
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Mano de obra */}
                <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">Mano de Obra</h4>
                  </div>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{formatCurrency(manoObra)}</span>
                </div>

                {/* Repuestos */}
                {ServiceData.repuestos && ServiceData.repuestos.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-gray-800 dark:text-gray-200">
                      <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      Repuestos Utilizados
                    </h4>
                    <div className="space-y-2 ml-6">
                      {ServiceData.repuestos.map((repuesto, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-700 dark:text-gray-300">
                            {repuesto.producto_nombre}
                            <span className="text-gray-500 dark:text-gray-400 ml-2">(x{repuesto.cantidad})</span>
                          </span>
                          <span className="text-gray-800 dark:text-gray-200">{formatCurrency(repuesto.importe)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between font-medium mt-2 pt-2 border-t dark:border-gray-700 text-gray-800 dark:text-gray-200">
                      <span>Total Repuestos:</span>
                      <span>{formatCurrency(totalRepuestos)}</span>
                    </div>
                  </div>
                )}

                {/* Motivos de ingreso */}
                {ServiceData.motivos && ServiceData.motivos.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Servicios Adicionales</h4>
                    <div className="space-y-2 ml-6">
                      {ServiceData.motivos.map((motivo, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-700 dark:text-gray-300">{motivo.motivo_ingreso}</span>
                          <span className="text-gray-800 dark:text-gray-200">{formatCurrency(motivo.precio_motivo)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between font-medium mt-2 pt-2 border-t dark:border-gray-700 text-gray-800 dark:text-gray-200">
                      <span>Total Servicios:</span>
                      <span>{formatCurrency(totalMotivos)}</span>
                    </div>
                  </div>
                )}

                {/* Resumen total */}
                <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4 mt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-gray-800 dark:text-gray-200">TOTAL A PAGAR:</span>
                    <span className="text-green-600 dark:text-green-400 text-xl">
                      {formatCurrency(ServiceData.precioTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Columna lateral - Opciones de pago */}
        <div className="space-y-6">
          {/* Tarjeta de opciones de pago */}
          <Card className="border-2 border-green-200 dark:border-green-600 dark:bg-gray-800">
            <CardHeader className="bg-green-50 dark:bg-green-900 border-b dark:border-gray-700">
              <CardTitle className="text-green-700 dark:text-green-300">Opciones de Pago</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <Button
                onClick={() => handlePagar(false)}
                disabled={isProcessing || estaPagado}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                size="lg"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2 justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Procesando...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 justify-center">
                    <DollarSign className="h-4 w-4" />
                    <span>Pagar Servicio</span>
                  </div>
                )}
              </Button>

              <Button
                onClick={() => handlePagar(true)}
                disabled={isProcessing || estaPagado}
                variant="outline"
                className="w-full border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 py-3"
                size="lg"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2 justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 dark:border-blue-400"></div>
                    <span>Procesando...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 justify-center">
                    <Printer className="h-4 w-4" />
                    <span>Pagar e Imprimir</span>
                  </div>
                )}
              </Button>

              {estaPagado && (
                <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                  <div className="flex items-center gap-2 justify-center text-yellow-700 dark:text-yellow-300">
                    <Ban className="h-4 w-4" />
                    <span className="text-sm font-medium">Servicio ya pagado</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tarjeta de información importante */}
          <Card className="border-2 border-blue-200 dark:border-blue-600 bg-blue-50 dark:bg-blue-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-blue-800 dark:text-blue-200 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Información Importante
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-1.5"></div>
                  <span>Verifique que todos los datos sean correctos</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-1.5"></div>
                  <span>El servicio debe estar en estado "Terminado"</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-1.5"></div>
                  <span>Se recomienda imprimir la boleta para el cliente</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-1.5"></div>
                  <span>Una vez pagado, el servicio se marcará como completado</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Tarjeta de estado del servicio */}
          <Card className={`border-2 ${estaPagado ? 'border-green-200 dark:border-green-600 bg-green-50 dark:bg-green-900' : 'border-blue-200 dark:border-blue-600 bg-blue-50 dark:bg-blue-900'}`}>
            <CardContent className="pt-6">
              <div className="text-center">
                {estaPagado ? (
                  <>
                    <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-3" />
                    <h3 className="font-semibold text-green-800 dark:text-green-200 text-lg">Pagado y Entregado</h3>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      El servicio ha sido pagado y entregado al cliente
                    </p>
                  </>
                ) : (
                  <>
                    <DollarSign className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 text-lg">Pendiente de Pago</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                      El servicio está listo para ser pagado y entregado
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}