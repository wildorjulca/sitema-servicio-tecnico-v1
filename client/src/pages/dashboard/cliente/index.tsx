import { DataTable } from "../ui/table-reutilizable";
import { useUser } from "@/hooks/useUser";
import { useState, useEffect } from "react";
import { ClientePag } from "@/interface";
import Loader from "@/components/sniper-carga/loader";
import { useClienteHook } from "@/hooks/useCliente";



export function Cliente() {
  const { user } = useUser();
  const usuarioId = user?.id;

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const { data, total, isLoading, isError, error, refetch } = useClienteHook(
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

  if (!usuarioId) return <div>Por favor inicia sesión para ver los clientes</div>;
  if (isLoading) return <div> <Loader /></div>;
  if (isError) {
    console.error("Error details:", error);
    return (
      <div>
        Error al cargar los clientes: {error?.message || "Unknown error"}
      </div>
    );
  }

  const mappedRol = data.map((tipo: ClientePag) => ({
    id: tipo.idCliente,
    nombre: tipo.nombre,
    apellidos: tipo.apellidos,
    tipo_doc_id: tipo.TIPO_DOCUMENTO_cod_tipo,
    numero_doc: tipo.numero_documento,
    direccion: tipo.direccion,
    telefono: tipo.telefono,
  }));

  return (
    <div className="w-full">
      <DataTable
        data={mappedRol}
        columns={[
          { accessorKey: "nombre", header: "Nombre" },
          { accessorKey: "apellidos", header: "Apellidos" },
          { accessorKey: "tipo_doc_id", header: "Tipo Doc" },
          { accessorKey: "numero_doc", header: "Numero Doc" },
          { accessorKey: "direccion", header: " Direccion" },
          { accessorKey: "telefono", header: " N° Celular" },
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