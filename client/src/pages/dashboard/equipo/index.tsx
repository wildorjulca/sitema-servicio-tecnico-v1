import { useEquipoHook, useAddEquipoHook, useEditEquipoHook, useDeleteEquipoHook } from "@/hooks/useEquipoHook";
import { DataTable } from "../ui/table-reutilizable";
import { useUser } from "@/hooks/useUser";
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useEnterKey } from "@/utils/hotkeys";
import { AxiosError } from "axios"; // Importar AxiosError

interface Equipo {
  id: number;
  nombreequipo: string;
  usuarioId?: number;
}

export function Equipo() {
  const { user } = useUser();
  const usuarioId = user?.id;

  const inputRef = useRef<HTMLInputElement>(null);

  // Paginación
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const { data, total, isLoading, isError } = useEquipoHook(usuarioId, pageIndex, pageSize);

  const addEquipo = useAddEquipoHook(usuarioId!);
  const editEquipo = useEditEquipoHook(usuarioId!);
  const deleteEquipo = useDeleteEquipoHook(usuarioId!);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentEquipo, setCurrentEquipo] = useState<Equipo | null>(null);
  const [equipoName, setEquipoName] = useState("");

  // Activar Enter para guardar
  useEnterKey(handleSave, inputRef, dialogOpen);

  // Refrescar al cambiar página, tamaño o datos
  useEffect(() => {
    if (usuarioId && data) {
      console.log("Datos de equipos:", { data, total });
      setTotalRows(total);
    }
  }, [pageIndex, pageSize, usuarioId, data, total]);

  if (!usuarioId) return <div>Por favor inicia sesión para ver tus equipos</div>;
  if (isLoading) return <div>Cargando equipos...</div>;
  if (isError) return <div>Error al cargar equipos</div>;

  // Abrir modal para agregar
  const openAddModal = () => {
    setCurrentEquipo(null);
    setEquipoName("");
    setDialogOpen(true);
  };

  // Abrir modal para editar
  const openEditModal = (equipo: Equipo) => {
    setCurrentEquipo({ id: equipo.id, nombreequipo: equipo.nombreequipo, usuarioId });
    setEquipoName(equipo.nombreequipo);
    setDialogOpen(true);
  };

  // Guardar cambios
  function handleSave() {
    if (!equipoName.trim()) {
      toast.error("El nombre del equipo no puede estar vacío");
      return;
    }

    if (currentEquipo) {
      editEquipo.mutate(
        { id: currentEquipo.id, nombreequipo: equipoName, usuarioId },
        {
          onSuccess: () => setDialogOpen(false),
          onError: (error: AxiosError<{ mensaje?: string }>) => {
            toast.error(error.response?.data?.mensaje || "Error al actualizar el equipo");
          },
        }
      );
    } else {
      addEquipo.mutate(
        { nombreequipo: equipoName },
        {
          onSuccess: () => setDialogOpen(false),
          onError: (error: AxiosError<{ mensaje?: string }>) => {
            toast.error(error.response?.data?.mensaje || "Error al agregar el equipo");
          },
        }
      );
    }
  }

  // Eliminar equipo
  const handleDelete = (equipo: Equipo) => {
    if (!equipo.id) {
      toast.error("No se puede eliminar: ID del equipo no definido");
      return;
    }

    deleteEquipo.mutate(equipo.id, {
      onSuccess: () => toast.success("Equipo eliminado"),
      onError: (error: AxiosError<{ mensaje?: string }>) => {
        toast.error(error.response?.data?.mensaje || "Error al eliminar el equipo");
      },
    });
  };

  // Mapear equipos para la tabla
  const mappedEquipos = data?.map((e: { idequipo: number; nombreequipo: string; usuarioId?: number }) => ({
    id: e.idequipo,
    nombreequipo: e.nombreequipo,
    usuarioId: e.usuarioId,
  })) || [];

  return (
    <div className="w-full">
      <DataTable
        data={mappedEquipos}
        columns={[{ accessorKey: "nombreequipo", header: "Nombre" }]}
        searchColumn="nombreequipo"
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalRows={totalRows}
        onPageChange={(newPage) => setPageIndex(newPage)}
        onPageSizeChange={(size) => setPageSize(size)}
        onEdit={openEditModal}
        onDelete={handleDelete}
        onRowSelect={(row) => {
          setCurrentEquipo({ id: row.id, nombreequipo: row.nombreequipo });
          setEquipoName(row.nombreequipo);
        }}
        actions={<Button onClick={openAddModal}>Agregar Equipo</Button>}
      />

      {/* ----------------- MODAL ----------------- */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentEquipo ? "Editar Equipo" : "Agregar Equipo"}</DialogTitle>
          </DialogHeader>

          <Input
            ref={inputRef}
            placeholder="Nombre del equipo"
            value={equipoName}
            onChange={(e) => setEquipoName(e.target.value)}
            className="mb-4"
          />

          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {currentEquipo ? "Actualizar" : "Agregar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
