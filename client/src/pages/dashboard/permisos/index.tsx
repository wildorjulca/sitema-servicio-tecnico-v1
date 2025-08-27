import { DataTable } from "../ui/table-reutilizable";
import { useUser } from "@/hooks/useUser";
import { useState, useEffect } from "react";
import { usePermisoHook } from "@/hooks/usePermiso";
import { PermisoPag } from "@/interface";



export function Permiso() {
  const { user } = useUser();
  const usuarioId = user?.id;

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const { data, total, isLoading, isError, error, refetch } = usePermisoHook(
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
  if (isLoading) return <div>Cargando tipos de documento...</div>;
  if (isError) {
    console.error("Error details:", error);
    return (
      <div>
        Error al cargar tipos de documento: {error?.message || "Unknown error"}
      </div>
    );
  }

  const mappedTiposDoc = data.map((tipo: PermisoPag) => ({
    id: tipo.id,
    nombre: tipo.nombre,
    descripcion: tipo.descripcion,
  }));

  return (
    <div className="w-full">
      <DataTable
        data={mappedTiposDoc}
        columns={[
          { accessorKey: "id", header: "Código" },
          { accessorKey: "nombre", header: "Permiso" },
          { accessorKey: "descripcion", header: "Descripcion del Permiso" },
        ]}
        searchColumn="nombre"
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalRows={totalRows}
        onPageChange={(newPage) => setPageIndex(newPage)}
        onPageSizeChange={(size) => setPageSize(size)}
      />
    </div>
  );
}