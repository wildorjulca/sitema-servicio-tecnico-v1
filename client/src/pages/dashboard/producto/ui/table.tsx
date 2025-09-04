import { useUser } from "@/hooks/useUser";
import { useState,  useEffect } from "react";
import { DataTable } from "../../ui/table-reutilizable";
import { useProductosHook } from "@/hooks/useProductoHook";
import { Productos } from "@/interface";



export function TableProducto() {
  const { user } = useUser();
  const usuarioId = user?.id;


  // Paginación
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0); // Estado para el total de registros

  const { data, total, isLoading, isError, refetch } = useProductosHook(usuarioId, pageIndex, pageSize);


  // Activar Enter para guardar

  // Refrescar al cambiar página, tamaño o datos
  useEffect(() => {
    if (usuarioId && data) {
      console.log("Datos de productos:", { data, total });
      setTotalRows(total); // Actualizar el total de registros
      refetch();
    }
  }, [pageIndex, pageSize, usuarioId, total]);

  if (!usuarioId) return <div>Por favor inicia sesión para ver tus Productos</div>;
  if (isLoading) return <div>Cargando Productos...</div>;
  if (isError) return <div>Error al cargar Productos</div>;


  const mappedProduct = data.map((p: Productos) => ({
    id: p.id,
    nombre: p.nombre,
    desc: p.descripcion,
    precio_venta: p.precio_venta,
    precio_compra: p.precio_compra,
    stock: p. stock,
    categoria: p.categoria_id,
    estado: p.estado
  }));
  return (
    <div className="w-full">
      <DataTable
        data={mappedProduct}
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