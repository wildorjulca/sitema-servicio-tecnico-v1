import { DataTable } from "../ui/table-reutilizable";
import { useUser } from "@/hooks/useUser";
import { useState, useEffect } from "react";
import { useAddUserHook, useDeleteUserHook, useEditUserHook, useUserHook } from "@/hooks/useUsers";
import { Users } from "@/apis/usuario";
import { Button } from "@/components/ui/button";
import { UsuarioFormData } from "@/lib/zods"; // Asegúrate de tener este tipo
import UsuarioModal from "./ui/modalUser";

export function Usuarios() {
  const { user } = useUser();
  const usuarioId = user?.id;

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Users | null>(null);

  // Hooks de queries
  const { data, total, isLoading, isError, error } = useUserHook(
    usuarioId,
    pageIndex,
    pageSize
  );

  // Hooks de mutaciones
  const addUserMutation = useAddUserHook(usuarioId!);
  const editUserMutation = useEditUserHook(usuarioId!);
  const deleteUserMutation = useDeleteUserHook(usuarioId!);

  // Efecto para actualizar el total de filas
  useEffect(() => {
    if (usuarioId && data) {
      console.log("Datos de useUser:", { data, total });
      setTotalRows(total);
    }
  }, [data, total, usuarioId]);

  // Función para abrir modal de agregar
  const openAddModal = () => {
    setCurrentUser(null);
    setIsModalOpen(true);
  };

  // Función para abrir modal de editar
  const openEditModal = (user: any) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  // Función para eliminar usuario
  const handleDelete = (user: any) => {
    if (window.confirm(`¿Estás seguro de eliminar al usuario ${user.nombre} ${user.apellidos}?`)) {
      deleteUserMutation.mutate(user.id);
    }
  };

  // En tu componente principal, modifica la función handleSaveUser:
const handleSaveUser = (userData: UsuarioFormData) => {
  console.log("🔍 DEBUG handleSaveUser:");
  console.log("usuarioId:", usuarioId); // ← VERIFICA QUE NO SEA UNDEFINED
  console.log("currentUser:", currentUser);

  // ✅ VALIDAR QUE usuarioId EXISTA
  if (!usuarioId) {
    toast.error("Error: Usuario no autenticado");
    return;
  }

  if (currentUser) {
    // ✅ EDITAR - Enviar ambos IDs claramente
    const editPayload = {
      id: currentUser.id,           // ID del registro a editar
      ...userData,
      usuarioId: usuarioId          // ID de QUIÉN edita (asegurar que no es undefined)
    };
    
    console.log("📤 Payload para EDITAR:", editPayload);
    editUserMutation.mutate(editPayload);
  } else {
    // ✅ CREAR - También necesita saber QUIÉN crea
    const createPayload = {
      ...userData,
      usuarioId: usuarioId          // ID de QUIÉN crea
    };
    
    console.log("📤 Payload para CREAR:", createPayload);
    addUserMutation.mutate(createPayload);
  }
  
  setIsModalOpen(false);
};

  // Cerrar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
  };

  if (!usuarioId) return <div>Por favor inicia sesión para ver los Usuarios</div>;
  if (isLoading) return <div>Cargando los Usuarios...</div>;
  if (isError) {
    console.error("Error details:", error);
    return (
      <div>
        Error al cargar usuarios: {error?.message || "Unknown error"}
      </div>
    );
  }
  if (!usuarioId) {
    return <div>Error: Usuario no autenticado</div>;
  }

  // Mapear los datos para la tabla
  const mappedUser = data.map((user: Users) => ({
    id: user.id,
    nombre: user.nombre,
    apellidos: user.apellidos,
    dni: user.dni,
    telefono: user.telefono,
    user: user.usuario,
    contra: user.password,
    rol: user.rol_id,
    // Incluir el objeto completo para usar en edición
    original: user
  }));

  return (
    <div className="w-full">
      <DataTable
        data={mappedUser}
        columns={[
          { accessorKey: "nombre", header: "Nombre" },
          { accessorKey: "apellidos", header: "Apellidos" },
          { accessorKey: "dni", header: "DNI" },
          { accessorKey: "telefono", header: "Celular" },
          { accessorKey: "user", header: "Usuario" },
          { accessorKey: "rol", header: "ID Rol" },
        ]}
        searchColumn="nombre"
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalRows={totalRows}
        onPageChange={(newPage) => setPageIndex(newPage)}
        onPageSizeChange={(size) => setPageSize(size)}
        onEdit={(row) => openEditModal(row.original)} // Pasar el usuario completo
        onDelete={(row) => handleDelete(row.original)} // Pasar el usuario completo
        actions={<Button onClick={openAddModal}>Agregar Usuario</Button>}
      />

      {/* Modal de Usuario */}
      <UsuarioModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={handleSaveUser}
        currentUsuario={currentUser}
        usuarioId={usuarioId}
        isSubmitting={addUserMutation.isPending || editUserMutation.isPending}
      />
    </div>
  );
}