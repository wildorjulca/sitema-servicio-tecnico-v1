import { useUser } from "@/hooks/useUser";
import { useState, useEffect } from "react";
import Loader from "@/components/sniper-carga/loader";
import { useEstadoHook, useIniciarReparacion, useServicioHook } from "@/hooks/useService";
import { Servicio } from "@/interface/types";
import { SelectWithCheckbox } from "@/components/chexbox/SelectWithCheckbox";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { DataTableService } from "../../../ui/table-service";
import { Plus } from "lucide-react";

 interface X{
  id:number,
 }

export default function Listar_Servicio() {
  const { user } = useUser();
  const usuarioId = user?.id;
  const navigate = useNavigate();

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filtros, setFiltros] = useState<{ estadoId?: number; clienteId?: number }>({});
  const [totalRows, setTotalRows] = useState(0);

  const { data, total, isLoading, isError, error } = useServicioHook(
    usuarioId,
    pageIndex,
    pageSize,
    filtros
  );

  const { data: estados, isLoading: isLoadingEstados } = useEstadoHook();
  const { mutate: iniciarReparacion } = useIniciarReparacion();

  const estadosOptions = estados.map(est => ({
    value: est.idEstado,
    label: est.nombre
  }));

  useEffect(() => {
    if (usuarioId && data) {
      console.log("Datos de listar servicio:", { data, total });
      setTotalRows(total);
    }
  }, [data, total, usuarioId]);

  const handleFiltroEstadoChange = (value: number | null) => {
    setPageIndex(0);
    setFiltros(prev => ({
      ...prev,
      estadoId: value || undefined
    }));
  };

  // Funciones para las acciones
  const handleView = (servicio: X) => {
    navigate(`/dashboard/list/dex/${servicio.id}`);
  };

  const handleRepair = (servicio: X) => {
    // Iniciar reparación antes de navegar
    iniciarReparacion(
      { 
        servicioId: servicio.id, 
        usuarioId: usuarioId 
      },
      {
        onSuccess: () => {
          // Navegar solo si fue exitoso
          navigate(`/dashboard/repare/${servicio.id}`);
        }
        // El error se maneja en el hook con toast
      }
    );
  };

  const handleDeliver = (servicio: X) => {
    navigate(`/dashboard/entregar/${servicio.id}`);
  };

  const handlePrint = (servicio: X) => {
    navigate(`/dashboard/imprimir/${servicio.id}`);
  };

  const handleEdit = (servicio: X) => {
    navigate(`/dashboard/editar/${servicio.id}`);
  };

  const handleClearFilters = () => {
    setPageIndex(0);
    setFiltros({});
  };

  // Función para determinar el estado de los botones
  const getActionState = (servicio: any) => {
    const isRepairDisabled = 
      servicio.estadoId === 3 || // Ya reparado (Terminado)
      (servicio.estadoId === 2 && servicio.usuarioSolucionaId !== usuarioId); // En reparación por otro técnico

    const repairText = 
      servicio.estadoId === 3 
        ? "Ya Reparado" 
        : servicio.estadoId === 2 && servicio.usuarioSolucionaId !== usuarioId 
          ? "En Reparación (Otro)" 
          : servicio.estadoId === 2 && servicio.usuarioSolucionaId === usuarioId 
            ? "Continuar Reparación" 
            : "Reparar";

    const repairVariant = 
      servicio.estadoId === 3 
        ? "outline" 
        : servicio.estadoId === 2 
          ? "secondary" 
          : "default";

    const repairClassName = 
      servicio.estadoId === 2 && servicio.usuarioSolucionaId === usuarioId 
        ? "bg-orange-500 hover:bg-orange-600 text-white" 
        : "";

    const isDeliverDisabled = servicio.estadoId !== 3; // Solo habilitado si estado es 3 (Terminado)

    return {
      canRepair: !isRepairDisabled,
      repairText,
      repairVariant,
      repairClassName,
      isDeliverDisabled
    };
  };

  const columns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "cod", header: "Código" },
    { accessorKey: "cliente", header: "Cliente" },
    { accessorKey: "equipo", header: "Equipo" },
    { accessorKey: "marca", header: "Marca" },
    { accessorKey: "modelo", header: "Modelo" },
    { accessorKey: "motivoIngreso", header: "Motivo Ingreso" },
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
            className += " bg-blue-100 text-blue-800";
            break;
          case "En Reparación":
            className += " bg-orange-100 text-orange-800";
            break;
          case "Terminado":
            className += " bg-green-100 text-green-800";
            break;
          case "Entregado":
            className += " bg-gray-100 text-gray-800";
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

  const MapedService = data.map((ser: Servicio) => ({
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
    <div className="w-full space-y-4 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Listado de Servicios</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Mostrando {MapedService.length} de {totalRows} servicios
          </span>
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

      <DataTableService
        data={MapedService}
        columns={columns}
        searchColumn="cliente"
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalRows={totalRows}
        onPageChange={(newPage) => setPageIndex(newPage)}
        onPageSizeChange={(size) => setPageSize(size)}

        // Pasar TODAS las acciones que quieres mostrar
        onView={handleView}
        onRepair={handleRepair}
        onDeliver={handleDeliver}
        onPrint={handlePrint}
        onEdit={handleEdit}

        // Pasar la función de validación
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