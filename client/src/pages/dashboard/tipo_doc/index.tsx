import { DataTable } from "../ui/table-reutilizable";
import { useUser } from "@/hooks/useUser";
import { useState, useEffect } from "react";
import { useTipoDocHook } from "@/hooks/useTipoDoc";

interface TipoDoc {
  cod_tipo: string;
  nombre_tipo: string;
  cant_digitos: number;
}

export function Tipo_doc() {
  const { user } = useUser();
  const usuarioId = user?.id;

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const { data, total, isLoading, isError, error, refetch } = useTipoDocHook(
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
        {error?.response?.status === 404 && (
          <p>El endpoint no se encuentra. Verifica la URL del API.</p>
        )}
      </div>
    );
  }

  const mappedTiposDoc = data.map((tipo: TipoDoc) => ({
    id: tipo.cod_tipo,
    nombre: tipo.nombre_tipo,
    cant_digitos: tipo.cant_digitos,
  }));

  return (
    <div className="w-full">
      <DataTable
        data={mappedTiposDoc}
        columns={[
          { accessorKey: "nombre", header: "Nombre" },
          { accessorKey: "id", header: "Código" },
          { accessorKey: "cant_digitos", header: "Cantidad de Dígitos" },
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