import { useUser } from "@/hooks/useUser";
import { useState, useEffect } from "react";
import Loader from "@/components/sniper-carga/loader";
import { DataTable } from "../../ui/table-reutilizable";
import { useServicioHook } from "@/hooks/useService";
import { Servicio } from "@/interface/types";
import { CellContext } from "@tanstack/react-table";
interface ServicioMapeado {

  precioTotal: string;
  estado: string;
}

type TableCellProps<T> = CellContext<T, unknown>;

export default function Listar_Servicio() {
  const { user } = useUser();
  const usuarioId = user?.id;

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const columns = [
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
      cell: ({ getValue }: TableCellProps<ServicioMapeado>) => (
        <span className="text-green-700 font-semibold font-sans">
          {getValue() as string}
        </span>
      )
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ getValue }: TableCellProps<ServicioMapeado>) => {
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
  const { data, total, isLoading, isError, error, refetch } = useServicioHook(
    usuarioId,
    pageIndex,
    pageSize
  );

  useEffect(() => {
    if (usuarioId && data) {
      console.log("Datos de useTipoDocHook:", { data, total });
      setTotalRows(total);
      refetch();
    }
  }, [pageIndex, pageSize, usuarioId, total, refetch]);

  if (!usuarioId) return <div>Por favor inicia sesión para ver los tipos de documento</div>;
  if (isLoading) return <div> <Loader /></div>;
  if (isError) {
    console.error("Error details:", error);
    return (
      <div>
        Error al cargar tipos de documento: {error?.message || "Unknown error"}
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
    fechaEntrega: new Date(ser.fechaEntrega).toLocaleDateString(),
    precioRepuestos: ser.precioRepuestos,
    estado: ser.estado,
    estadoId: ser.estado_id,
    precioTotal: `S/. ${ser.precioTotal.toFixed(2)}`,
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
    <div className="w-full">
      <DataTable
        data={MapedService}
        columns={columns}
        searchColumn="cliente"
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalRows={totalRows}
        onPageChange={(newPage) => setPageIndex(newPage)}
        onPageSizeChange={(size) => setPageSize(size)}
      />


      <p>  </p>
    </div>

  );
}