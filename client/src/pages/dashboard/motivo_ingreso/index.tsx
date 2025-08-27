import { DataTable } from "../ui/table-reutilizable";
import { useUser } from "@/hooks/useUser";
import { useState, useEffect, useRef } from "react";
import { MotivoIngresoPag } from "@/interface";
import Loader from "@/components/sniper-carga/loader";
import { useAddMotivoIngreso, useDeleteMotivoIngreso, useEditMotivoIngreso, useMotivoIngresoHook } from "@/hooks/useMotivoIngreso";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEnterKey } from "@/utils/hotkeys";
import toast from "react-hot-toast";

interface Mot {
  id: number;
  descripcion: string;
  precio_cobrar: number;
  usuarioId?: number;
}


export function Motivo_Ingreso() {
  const { user } = useUser();
  const usuarioId = user?.id;

  const inputRef = useRef<HTMLInputElement>(null);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const { data, total, isLoading, isError, error, refetch } = useMotivoIngresoHook(
    usuarioId,
    pageIndex,
    pageSize
  );

  const addBrand = useAddMotivoIngreso(usuarioId!);
  const editBrand = useEditMotivoIngreso(usuarioId!);
  const deleteBrand = useDeleteMotivoIngreso(usuarioId!);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentBrand, setCurrentBrand] = useState<Mot | null>(null);
  const [descripcion, setDescripcion] = useState("");
  const [precio_cobrar, setPrecio_cobrar] = useState("");

  // Activar Enter para guardar
  useEnterKey(handleSave, inputRef, dialogOpen);

  useEffect(() => {
    if (usuarioId && data) {
      console.log("Datos de useTipoDocHook:", { data, total });
      setTotalRows(total);
      refetch();
    }
  }, [pageIndex, pageSize, usuarioId, total, refetch]);

  if (!usuarioId) return <div>Por favor inicia sesión para ver los motivos de Ingreso</div>;
  if (isLoading) return <div> <Loader /></div>;
  if (isError) {
    console.error("Error details:", error);
    return (
      <div>
        Error al cargar motivos de Ingreso: {error?.message || "Unknown error"}
      </div>
    );
  }

  // Abrir modal para agregar
  const openAddModal = () => {
    setCurrentBrand(null);
    setDescripcion("");
    setPrecio_cobrar("");
    setDialogOpen(true);
  };

  // Abrir modal para editar
  const openEditModal = (brand: Mot) => {
    setCurrentBrand({ id: brand.id, descripcion: brand.descripcion, precio_cobrar: brand.precio_cobrar, usuarioId });
    setDescripcion(descripcion);
    setPrecio_cobrar(precio_cobrar);
    setDialogOpen(true);
  };

  // Guardar cambios
  function handleSave() {
    if (!descripcion.trim()) {
      toast.error("El nombre no puede estar vacío");
      return;
    }

    if (currentBrand) {
      editBrand.mutate(
        { id: currentBrand.id, descripcion, precio_cobrar, usuarioId },
        { onSuccess: () => setDialogOpen(false) }
      );
    } else {
      addBrand.mutate(
        { descripcion,precio_cobrar, usuarioId },
        { onSuccess: () => setDialogOpen(false) }
      );
    }
  }

  // Eliminar marca
  const handleDelete = (brand: Mot) => {
    if (!brand.id) {
      toast.error("No se puede eliminar: ID de la marca no definido");
      return;
    }

    deleteBrand.mutate(brand.id, {
      onSuccess: () => toast.success("Marca eliminada"),
      onError: () => toast.error("Error al eliminar la marca"),
    });
  };

  // Mapear marcas para la tabla

  const mappedRol = data.map((tipo: MotivoIngresoPag) => ({
    id: tipo.idMotivo,
    descripcion: tipo.descripcion,
    precio_cobrar: tipo.precio_cobrar,
  }));

  return (
    <div className="w-full">
      <DataTable
        data={mappedRol}
        columns={[
          {
            accessorKey: "descripcion",
            header: "Motivos de Ingresos",
          },
          {
            accessorKey: "precio_cobrar",
            header: "Costo del Servicio",
            cell: ({ row }) => {
              const value = row.getValue("precio_cobrar");
              return (
                <span
                  className={
                    value === null
                      ? "text-gray-400 italic" // Si está vacío, gris e itálico
                      : "text-green-600 font-semibold" // Si tiene precio, verde
                  }
                >
                  {value === null ? "Por definir" : `S/ ${value}`}
                </span>
              );
            },
          },
        ]}
        searchColumn="descripcion"
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalRows={totalRows}
        onPageChange={(newPage) => setPageIndex(newPage)}
        onPageSizeChange={(size) => setPageSize(size)}
        onEdit={openEditModal}
        onDelete={handleDelete}
        onRowSelect={(row) => {
          setCurrentBrand({ id: row.id, descripcion: row.descripcion , precio_cobrar: row.precio_cobrar});
          setDescripcion(row.descripcion);
        }}
        actions={<Button onClick={openAddModal}>Agregar Motivo</Button>}
      />


      {/* ----------------- MODAL ----------------- */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentBrand ? "Editar Motivo Ingreso" : "Agregar Motivo Ingreso"}</DialogTitle>
          </DialogHeader>

          <Input
            ref={inputRef}
            placeholder="Nombre del Motivo Ingreso"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="mb-4"
          />
          <Input
            ref={inputRef}
            type="number"
            placeholder="precio a cobrar"
            value={precio_cobrar}
            onChange={(e) => setPrecio_cobrar(e.target.value)}
            className="mb-4"
          />

          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {currentBrand ? "Actualizar" : "Agregar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

  );
}