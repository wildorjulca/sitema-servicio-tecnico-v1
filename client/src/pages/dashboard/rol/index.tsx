import { DataTable } from "../ui/table-reutilizable";
import { useUser } from "@/hooks/useUser";
import { useState, useEffect } from "react";
import { PermisoPag, RolPag } from "@/interface";
import { useRolHook } from "@/hooks/useRol";
import Loader from "@/components/sniper-carga/loader";



export function Roles() {
  const { user } = useUser();
  const usuarioId = user?.id;

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const { data, total, isLoading, isError, error, refetch } = useRolHook(
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
  if (isLoading) return <div> <Loader/></div>;
  if (isError) {
    console.error("Error details:", error);
    return (
      <div>
        Error al cargar tipos de documento: {error?.message || "Unknown error"}
      </div>
    );
  }

  const mappedRol = data.map((tipo: RolPag) => ({
    id: tipo.id,
    tipo_rol: tipo.tipo_rol,
  }));

  return (
    <div className="w-full">
      <DataTable
        data={mappedRol}
        columns={[
          { accessorKey: "id", header: "Código" },
          { accessorKey: "tipo_rol", header: "Tipo de Usuario" },
        ]}
        searchColumn="tipo_rol"
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