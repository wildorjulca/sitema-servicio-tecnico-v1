import { useUser } from "@/hooks/useUser";
import { useState, useEffect } from "react";
import { ServicioEquipo } from "@/interface";
import Loader from "@/components/sniper-carga/loader";
import { DataTable } from "../dashboard/ui/table-reutilizable";
import { useServicioEquipoHook } from "@/hooks/useServicioEquipo";
import { useMarcas } from "@/hooks/useMarcaHook";
import { SelectWithCheckbox } from "@/components/chexbox/SelectWithCheckbox";

export default function Servicio_Equipos() {
  const { user } = useUser();
  const usuarioId = user?.id;

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [filtroMarca, setFiltroMarca] = useState<number | null>(null);

  const { data: marcasData, isLoading: isLoadingMarcas } = useMarcas();
  const { data, total, isLoading } = useServicioEquipoHook(
    usuarioId,
    pageIndex,
    pageSize,
    { filtroMarca }
  );

  useEffect(() => {
    if (usuarioId && data) {
      setTotalRows(total);
    }
  }, [pageIndex, pageSize, usuarioId, total, data]);

  // Preparar las opciones para el Select
  const marcaOptions = marcasData.map(marca => ({
    value: marca.idMarca,
    label: marca.nombreMarca
  }));

  if (!usuarioId) return <div>Por favor inicia sesión para ver los equipos</div>;
  if (isLoadingMarcas || isLoading) return <div><Loader /></div>;

  const mappedServicioE = data.map((se: ServicioEquipo) => ({
    id: se.idServicioEquipos,
    nombre_equipo: se.nombre_equipo,
    nombre_marca: se.nombre_marca,
    modelo: se.modelo,
    serie: se.serie,
    codigo_barras: se.codigo_barras
  }));

  return (
    <div className="w-full space-y-2">
      {/* --- Filtros --- */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {/* Usando el componente reutilizable */}
        <SelectWithCheckbox
          value={filtroMarca}
          onValueChange={(value) => {
            setPageIndex(0);
            setFiltroMarca(value as number | null);
          }}
          options={marcaOptions}
          label="Filtrar por Marca :"
          placeholder="Seleccionar marca"
        />
      </div>

      {/* --- Tabla --- */}
      <DataTable
        data={mappedServicioE}
        columns={[
          { accessorKey: "nombre_equipo", header: "Equipo" },
          { accessorKey: "nombre_marca", header: "Marca" },
          { accessorKey: "modelo", header: "Modelo" },
          { accessorKey: "serie", header: "Serie" },
          { accessorKey: "codigo_barras", header: "Cod" },
        ]}
        pageIndex={pageIndex}
        pageSize={pageSize}
        searchColumn="nombre_equipo"
        totalRows={totalRows}
        onPageChange={(newPage) => setPageIndex(newPage)}
        onPageSizeChange={(size) => setPageSize(size)}
      />
    </div>
  );
}