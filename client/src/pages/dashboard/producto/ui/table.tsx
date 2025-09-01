import { useUser } from "@/hooks/useUser";
import { useState,  useEffect } from "react";

import { DataTable } from "../../ui/table-reutilizable";
import { useProductos } from "@/hooks/usePorductoHook";



export function TableProducto() {
  const { user } = useUser();
  const usuarioId = user?.id;


  // Paginación
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0); // Estado para el total de registros

  const { data, total, isLoading, isError, refetch } = useProductos(usuarioId, pageIndex, pageSize);


  // Activar Enter para guardar

  // Refrescar al cambiar página, tamaño o datos
  useEffect(() => {
    if (usuarioId && data) {
      console.log("Datos de useBrands:", { data, total });
      setTotalRows(total); // Actualizar el total de registros
      refetch();
    }
  }, [pageIndex, pageSize, usuarioId, total]);

  if (!usuarioId) return <div>Por favor inicia sesión para ver tus marcas</div>;
  if (isLoading) return <div>Cargando marcas...</div>;
  if (isError) return <div>Error al cargar marcas</div>;

  // Mapear marcas para la tabla
  const mappedMarcas = data.map((m: { id: number; nombre: string; usuarioId?: number }) => ({
    id: m.id,
    nombre: m.nombre,
    usuarioId: m.usuarioId,
  })) || [];

  return (
    <div className="w-full">
      <DataTable
        data={mappedMarcas}
        columns={[{ accessorKey: "nombre", header: "Nombre" }]}
        searchColumn="nombre"
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalRows={totalRows} // Pasar el total de registros
        onPageChange={(newPage) => setPageIndex(newPage)}
        onPageSizeChange={(size) => setPageSize(size)}
  
      />

    </div>
  );
}