import { DataTable } from "../ui/table-reutilizable";
import { useUser } from "@/hooks/useUser";
import { useState, useEffect } from "react";
import { useUserHook } from "@/hooks/useUsers";
import { Users } from "@/apis/usuario";

export function Usuarios() {
  const { user } = useUser();
  const usuarioId = user?.id;

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const { data, total, isLoading, isError, error, refetch } = useUserHook(
    usuarioId,
    pageIndex,
    pageSize
  );

  useEffect(() => {
    if (usuarioId && data) {
      console.log("Datos de useUser:", { data, total });
      setTotalRows(total);
      refetch();
    }
  }, [pageIndex, pageSize, usuarioId, total, refetch]);

  if (!usuarioId) return <div>Por favor inicia sesión para ver los Usuarios</div>;
  if (isLoading) return <div>Cargando los Usuarios...</div>;
  if (isError) {
    console.error("Error details:", error);
    return (
      <div>
        Error al cargar tipos de documento: {error?.message || "Unknown error"}
      </div>
    );
  }

  const mappedUser = data.map((user: Users) => ({
    id: user.id,
    nombre: user.nombre,
    apellidos: user.apellidos,
    dni: user.dni,
    telefono: user.telefono,
    user : user.usuario,
    contra : user.password,
    rol : user.rol_id
  }));

  return (
    <div className="w-full">
      <DataTable
        data={mappedUser}
        columns={[
          { accessorKey: "nombre", header: "Nombre" },
          { accessorKey: "apellidos", header: "Apellidos" },
          { accessorKey: "dni", header: "Dni" },
          { accessorKey: "telefono", header: "Celular" },
          { accessorKey: "user", header: "Usuario" },
          { accessorKey: "rol", header: "Id Rol" },
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