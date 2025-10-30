import { useUser } from "@/hooks/useUser";
import { useState, useEffect } from "react";
import Loader from "@/components/sniper-carga/loader";
import {
  useEstadoHook,
  useIniciarReparacion,
  useServicioHook,
  useEntregarServicio,
  useCancelarServicio
} from "@/hooks/useService";
import { Servicio } from "@/interface/types";
import { SelectWithCheckbox } from "@/components/chexbox/SelectWithCheckbox";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { DataTableService } from "../../../ui/table-service";
import { Plus, Wifi, WifiOff, RefreshCw } from "lucide-react";

interface X {
  id: number,
}

export default function Listar_Servicio() {
  const { user } = useUser();
  const usuarioId = user?.id;
  const navigate = useNavigate();

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filtros, setFiltros] = useState<{ estadoId?: number; clienteId?: number }>({});
  const [totalRows, setTotalRows] = useState(0);

  const { data, total, isLoading, isError, error, isConnected } = useServicioHook(
    usuarioId,
    pageIndex,
    pageSize,
    filtros
  );

  const { data: estados, isLoading: isLoadingEstados } = useEstadoHook();
  const { mutate: iniciarReparacion } = useIniciarReparacion();
  const { mutate: entregarServicio } = useEntregarServicio();
  const { mutate: cancelarServicio, isPending: isCanceling } = useCancelarServicio();

  const estadosOptions = estados.map(est => ({
    value: est.idEstado,
    label: est.nombre
  }));

  useEffect(() => {
    if (usuarioId && data) {
      console.log("📊 Datos de listar servicio:", {
        dataCount: data.length,
        total,
        isConnected
      });
      setTotalRows(total);
    }
  }, [data, total, usuarioId, isConnected]);

  useEffect(() => {
    console.log("🔄 Estado WebSocket en componente:", isConnected);
  }, [isConnected]);

  const handleFiltroEstadoChange = (value: number | null) => {
    setPageIndex(0);
    setFiltros(prev => ({
      ...prev,
      estadoId: value || undefined
    }));
  };

  const handleView = (servicio: X) => {
    navigate(`/dashboard/list/${servicio.id}`);
  };

  const handleRepair = (servicio: any) => {
    const isSecretaria = user?.rol === 'SECRETARIA';

    if (isSecretaria) {
      navigate(`/dashboard/list/${servicio.id}/reparacion`);
    } else {
      iniciarReparacion(
        {
          servicioId: servicio.id,
          usuarioId: usuarioId
        },
        {
          onSuccess: () => {
            navigate(`/dashboard/list/${servicio.id}/reparacion`);
          }
        }
      );
    }
  };

  // ✅ NUEVA FUNCIÓN PARA MANEJAR PAGOS
  const handlePay = (servicio: any) => {
    const isSecretaria = user?.rol === 'SECRETARIA';

    if (isSecretaria) {
      // Navegar a la página de pago
      navigate(`/dashboard/list/${servicio.id}/pay`);
    } else {
      console.log("Solo las secretarias pueden procesar pagos");
    }
  };

  const handleDeliver = (servicio: X) => {
    const confirmar = window.confirm(
      `¿Estás seguro de que deseas marcar el servicio ${servicio.id} como entregado?\n\nEsta acción no se puede deshacer.`
    );

    if (confirmar && usuarioId) {
      entregarServicio(
        {
          servicio_id: servicio.id,
          usuario_entrega_id: usuarioId
        }
      );
    }
  };

  const handlePrint = (servicio: X) => {
    navigate(`/dashboard/list/${servicio.id}/imprimir`);
  };

  const handleClearFilters = () => {
    setPageIndex(0);
    setFiltros({});
  };

  const handleForceRefresh = () => {
    window.location.reload();
  };

  const handleCancel = (servicio: any) => {

    const usuarioPuedeCancelar = user?.rol === 'SECRETARIA' || user?.rol === 'TECNICO';

    if (!usuarioPuedeCancelar) {
      console.log("Solo secretarias y técnicos pueden cancelar servicios");
      return;
    }

    // Validar que el servicio no esté ya cancelado, entregado o facturado
    if (servicio.estadoId === 6) {
      alert("Este servicio ya está cancelado");
      return;
    }

    if (servicio.estadoId === 4 || servicio.estadoId === 5) {
      alert("No se puede cancelar un servicio ya entregado o facturado");
      return;
    }

    // ✅ VALIDACIONES ESPECÍFICAS POR ROL
    if (user?.rol === 'TECNICO') {
      // Técnicos solo pueden cancelar servicios que estén asignados a ellos
      if (servicio.estadoId === 2 && servicio.usuarioSolucionaId !== usuarioId) {
        alert("No puedes cancelar un servicio que está siendo reparado por otro técnico");
        return;
      }

      // Técnicos no pueden cancelar servicios terminados
      if (servicio.estadoId === 3) {
        alert("No puedes cancelar un servicio terminado. Contacta a la secretaria.");
        return;
      }
    }

    // Pedir motivo de cancelación
    const motivo = prompt(
      `¿Estás seguro de cancelar el servicio ${servicio.cod}?\n\n` +
      `Por favor ingresa el motivo de la cancelación (mínimo 5 caracteres):\n\n` +
      `Ej: ${user?.rol === 'TECNICO' ?
        'Cliente desistió, equipo irreparable, falta de repuestos, diagnóstico complejo' :
        'Cliente desistió, equipo irreparable, costo elevado, etc.'}`
    );

    // Validar el motivo
    if (motivo === null) {
      return; // Usuario canceló
    }

    if (!motivo.trim() || motivo.trim().length < 5) {
      alert("El motivo debe tener al menos 5 caracteres");
      return;
    }

    // Confirmación final con mensaje específico por rol
    const mensajeConfirmacion = user?.rol === 'TECNICO' ?
      `⚠️ CONFIRMAR CANCELACIÓN COMO TÉCNICO\n\n` +
      `Servicio: ${servicio.cod}\n` +
      `Cliente: ${servicio.cliente}\n` +
      `Motivo: ${motivo}\n\n` +
      `¿Estás seguro de proceder con la cancelación?\n\n` +
      `Esta acción:\n` +
      `• Liberará los repuestos reservados\n` +
      `• Marcará el servicio como cancelado\n` +
      `• Se notificará a la secretaria\n` +
      `• No se podrá deshacer` :
      `⚠️ CONFIRMAR CANCELACIÓN\n\n` +
      `Servicio: ${servicio.cod}\n` +
      `Cliente: ${servicio.cliente}\n` +
      `Motivo: ${motivo}\n\n` +
      `¿Estás seguro de proceder con la cancelación?\n\n` +
      `Esta acción:\n` +
      `• Liberará los repuestos reservados\n` +
      `• Marcará el servicio como cancelado\n` +
      `• No se podrá deshacer`;

    if (confirm(mensajeConfirmacion) && usuarioId) {
      cancelarServicio(
        {
          servicio_id: servicio.id,
          usuario_id: usuarioId,
          motivo: `${user?.rol === 'TECNICO' ? '[TÉCNICO] ' : '[SECRETARIA] '}${motivo.trim()}`
        },
        {
          onSuccess: (data) => {
            console.log("Servicio cancelado exitosamente:", data);
            // Mostrar mensaje diferente según el rol
            if (user?.rol === 'TECNICO') {
              alert("Servicio cancelado. Se ha notificado a la secretaria.");
            } else {
              alert("Servicio cancelado exitosamente.");
            }
          },
          onError: (error) => {
            console.error("Error al cancelar servicio:", error);
            alert("Error al cancelar el servicio: " + (error.response?.data?.mensaje || error.message));
          }
        }
      );
    }
  };


  const getActionState = (servicio: any) => {
    const isSecretaria = user?.rol === 'SECRETARIA';
    const isTecnico = user?.rol === 'TECNICO';

    if (isSecretaria) {
      // Para secretaria: puede pagar cuando el estado es "Terminado" (estadoId 3)
      const canPay = servicio.estadoId === 3;

      // Secretaria puede cancelar servicios que no estén terminados, entregados o ya cancelados
      const canCancel = servicio.estadoId !== 3 && servicio.estadoId !== 4 &&
        servicio.estadoId !== 5 && servicio.estadoId !== 6;

      return {
        canRepair: servicio.estadoId !== 4,
        canPay: canPay,
        canCancel: canCancel,
        repairText: "Agregar Repuestos",
        repairVariant: "default" as const,
        repairClassName: "bg-purple-500 hover:bg-purple-600 text-white",
        payText: canPay ? "Pagar Servicio" : "Servicio no terminado",
        payVariant: canPay ? "default" as const : "outline" as const,
        payClassName: canPay ? "bg-green-500 hover:bg-green-600 text-white" : "bg-gray-300 text-gray-600",
        cancelText: canCancel ? "Cancelar" : "No cancelable",
        cancelVariant: canCancel ? "destructive" as const : "outline" as const,
        cancelClassName: canCancel ? "bg-red-500 hover:bg-red-600 text-white" : "bg-gray-300 text-gray-600",
        isDeliverDisabled: true
      };
    } else if (isTecnico) {
      // Para técnico: lógica de reparación
      const isRepairDisabled = servicio.estadoId === 3 || servicio.estadoId === 4 ||
        (servicio.estadoId === 2 && servicio.usuarioSolucionaId !== usuarioId);

      const repairText = servicio.estadoId === 3 ? "Ya Reparado" :
        servicio.estadoId === 4 ? "Entregado" :
          servicio.estadoId === 2 && servicio.usuarioSolucionaId !== usuarioId ? "En Reparación (Otro)" :
            servicio.estadoId === 2 && servicio.usuarioSolucionaId === usuarioId ? "Continuar Reparación" : "Reparar";

      let repairVariant: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";

      if (servicio.estadoId === 3 || servicio.estadoId === 4) {
        repairVariant = "outline";
      } else if (servicio.estadoId === 2) {
        repairVariant = "secondary";
      } else {
        repairVariant = "default";
      }

      // ✅ TÉCNICO PUEDE CANCELAR SI:
      // - No está terminado, entregado o facturado
      // - Si está en reparación, debe ser el técnico asignado
      const canCancel = servicio.estadoId !== 3 &&
        servicio.estadoId !== 4 &&
        servicio.estadoId !== 5 &&
        servicio.estadoId !== 6 &&
        (servicio.estadoId !== 2 || servicio.usuarioSolucionaId === usuarioId);

      const cancelText = canCancel ? "Cancelar" :
        servicio.estadoId === 2 && servicio.usuarioSolucionaId !== usuarioId ?
          "En reparación (Otro)" : "No cancelable";

      return {
        canRepair: !isRepairDisabled,
        canPay: false, // Técnicos no pueden pagar
        canCancel: canCancel,
        repairText,
        repairVariant,
        repairClassName: servicio.estadoId === 2 && servicio.usuarioSolucionaId === usuarioId ?
          "bg-orange-500 hover:bg-orange-600 text-white" : "",
        cancelText,
        cancelVariant: canCancel ? "destructive" as const : "outline" as const,
        cancelClassName: canCancel ? "bg-red-500 hover:bg-red-600 text-white" : "bg-gray-300 text-gray-600",
        isDeliverDisabled: servicio.estadoId !== 3
      };
    } else {
      // Para otros roles (si los hay)
      return {
        canRepair: false,
        canPay: false,
        canCancel: false,
        repairText: "No disponible",
        repairVariant: "outline" as const,
        repairClassName: "bg-gray-300 text-gray-600",
        cancelText: "No disponible",
        cancelVariant: "outline" as const,
        cancelClassName: "bg-gray-300 text-gray-600",
        isDeliverDisabled: true
      };
    }
  };
  const columns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "cod", header: "Código" },
    { accessorKey: "cliente", header: "Cliente" },
    { accessorKey: "equipo", header: "Equipo" },
    { accessorKey: "marca", header: "Marca" },
    { accessorKey: "modelo", header: "Modelo" },
    { accessorKey: "usuarioRecibe", header: "Técnico Recibe" },
    { accessorKey: "usuarioSoluciona", header: "Técnico Soluciona" },
    { accessorKey: "fechaIngreso", header: "Fecha Ingreso" },
    {
      accessorKey: "precioTotal",
      header: "Precio Total",
      cell: ({ getValue }: any) => (
        <span className="text-green-700 font-semibold font-sans">
          {getValue() as string}
        </span>
      )
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ getValue }: any) => {
        const estado = getValue() as string;
        let className = "px-2 py-1 rounded-full text-xs font-medium";

        switch (estado) {
          case "Recibido":
            className += " bg-blue-400 text-blue-800";
            break;
          case "En Reparación":
            className += " bg-orange-400 text-orange-800";
            break;
          case "Terminado":
            className += " bg-green-400 text-green-800";
            break;
          case "Entregado":
            className += " bg-gray-400 text-gray-800";
            break;
          default:
            className += " bg-gray-100 text-gray-800";
        }

        return (
          <span className={className}>
            {estado}
          </span>
        );
      }
    }
  ];

  if (!usuarioId) return <div>Por favor inicia sesión para ver los dashboard</div>;
  if (isLoadingEstados || isLoading) return <div><Loader /></div>;
  if (isError) {
    console.error("Error details:", error);
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        Error al cargar servicios: {error?.message || "Error desconocido"}
      </div>
    );
  }

  const MapedService = data
  // .filter((ser:Servicio)=>ser.estado_id !==6)
  .map((ser: Servicio) => ({
    id: ser.idServicio,
    cod: ser.codigoSeguimiento,
    cliente: ser.cliente,
    fechaIngreso: new Date(ser.fechaIngreso).toLocaleDateString(),
    motivoIngreso: ser.motivo_ingreso,
    descripcionMotivo: ser.descripcion_motivo,
    observacion: ser.observacion,
    diagnostico: ser.diagnostico,
    solucion: ser.solucion,
    precio: ser.precio,
    usuarioRecibe: ser.usuario_recibe,
    usuarioSoluciona: ser.usuario_soluciona,
    fechaEntrega: ser.fechaEntrega ? new Date(ser.fechaEntrega).toLocaleDateString() : 'N/A',
    precioRepuestos: ser.precioRepuestos,
    estado: ser.estado,
    estadoId: ser.estado_id,
    precioTotal: `S/. ${ser.precioTotal?.toFixed(2) || '0.00'}`,
    equipo: ser.equipo,
    marca: ser.marca,
    modelo: ser.modelo,
    serie: ser.serie,
    codigoBarras: ser.codigo_barras,
    clienteId: ser.cliente_id,
    motivoIngresoId: ser.motivo_ingreso_id,
    usuarioRecibeId: ser.usuario_recibe_id,
    usuarioSolucionaId: ser.usuario_soluciona_id,
    servicioEquiposId: ser.servicio_equipos_id,
    marcaId: ser.MARCA_idMarca
  }));

  return (
    <div className="w-full space-y-2">
      {/* Indicador de estado WebSocket */}
      <div className={`p-1 rounded-md flex items-center justify-between ${isConnected ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
        }`}>
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <Wifi className="h-5 w-5 text-green-600" />
          ) : (
            <WifiOff className="h-5 w-5 text-yellow-600" />
          )}
          <span className={`font-medium ${isConnected ? 'text-green-700' : 'text-yellow-700'
            }`}>
            {isConnected ? ' Conectado en tiempo real' : ' Sin conexión en tiempo real'}
          </span>
        </div>

        {!isConnected && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleForceRefresh}
            className="flex items-center space-x-1"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Reconectar</span>
          </Button>
        )}
      </div>

      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Listado de Servicios</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-50">
            Mostrando {MapedService.length} de {totalRows} servicios
          </span>
          {isConnected && (
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
              ● En vivo
            </span>
          )}
        </div>
      </div>

      {/* --- Filtros --- */}
      <div className="grid grid-cols-2 md:grid-cols-12 gap-4 items-end">
        <div className="md:col-span-4">
          <SelectWithCheckbox
            value={filtros.estadoId || null}
            onValueChange={handleFiltroEstadoChange}
            options={estadosOptions}
            placeholder="Seleccionar el Estado"
          />
        </div>

        <div className="md:col-span-2">
          <Button variant={"outline"} onClick={handleClearFilters}>
            Limpiar Filtros
          </Button>
        </div>
      </div>

      {/* ✅ AGREGAR onPay AL DataTableService */}
      <DataTableService
        data={MapedService}
        columns={columns}
        searchColumn="cliente"
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalRows={totalRows}
        onPageChange={(newPage) => setPageIndex(newPage)}
        onPageSizeChange={(size) => setPageSize(size)}
        onView={handleView}
        onRepair={handleRepair}
        onDeliver={handleDeliver}
        onPrint={handlePrint}
        onPay={handlePay} // ✅ NUEVA PROPIEDAD
        onEdit={handleCancel}
        getActionState={getActionState}
        actions={<Link to={'/dashboard/new'}>
          <Button size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Nuevo servicio
          </Button>
        </Link>}
      />
    </div>
  );
}