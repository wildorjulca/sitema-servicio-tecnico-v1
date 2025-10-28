import { DataTable } from "../../ui/table-reutilizable";
import { useUser } from "@/hooks/useUser";
import { useState, useEffect, useRef } from "react";
import Loader from "@/components/sniper-carga/loader";
import { useAddCatHook, useCatHook, useDeleteCatHook, useEditCatHook } from "@/hooks/useCategoria";
import { CategoriaPag } from "@/interface";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEnterKey } from "@/utils/hotkeys";
import toast from "react-hot-toast";

export interface CategoriaPage {
  id: number;
  descripcion: string;
  esServicio: number;
  usuarioId?: number;
}

export function Categoria() {
  const { user } = useUser();
  const usuarioId = user?.id;

  const inputRef = useRef<HTMLInputElement>(null);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const { data, total, isLoading, isError, error, refetch } = useCatHook(
    usuarioId,
    pageIndex,
    pageSize
  );

  const addBrand = useAddCatHook(usuarioId!);
  const editBrand = useEditCatHook(usuarioId!);
  const deleteBrand = useDeleteCatHook(usuarioId!);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [currenCat, setCurrentCat] = useState<CategoriaPage | null>(null);
  const [descripcion, setDescripcion] = useState("");
  const [esServicio, setEsServicio] = useState<number>(0);

  // Activar Enter para guardar
  useEnterKey(handleSave, inputRef, dialogOpen);

  useEffect(() => {
    if (usuarioId && data) {
      console.log("Datos de useCatHook:", { data, total });
      setTotalRows(total);
      refetch();
    }
  }, [pageIndex, pageSize, usuarioId, total, refetch]);

  if (!usuarioId) return <div>Por favor inicia sesión para ver las categorías</div>;
  if (isLoading) return <div> <Loader /></div>;
  if (isError) {
    console.error("Error details:", error);
    return (
      <div>
        Error al cargar las categorías: {error?.message || "Unknown error"}
      </div>
    );
  }

  // Abrir modal para agregar
  const openAddModal = () => {
    setCurrentCat(null);
    setDescripcion("");
    setEsServicio(0);
    setDialogOpen(true);
  };

  // Abrir modal para editar
  const openEditModal = (brand: CategoriaPage) => {
    setCurrentCat({ id: brand.id, descripcion: brand.descripcion, esServicio: brand.esServicio, usuarioId });
    setDescripcion(brand.descripcion);
    setEsServicio(brand.esServicio);
    setDialogOpen(true);
  };

  // Guardar cambios
  function handleSave() {
    if (!descripcion.trim()) {
      toast.error("El nombre no puede estar vacío");
      return;
    }

    if (currenCat) {
      editBrand.mutate(
        { id: currenCat.id, descripcion, esServicio, usuarioId },
        { onSuccess: () => setDialogOpen(false) }
      );
    } else {
      addBrand.mutate(
        { descripcion, esServicio, usuarioId },
        { onSuccess: () => setDialogOpen(false) }
      );
    }
  }

  // Eliminar categoría
  const handleDelete = (brand: CategoriaPage) => {
    if (!brand.id) {
      toast.error("No se puede eliminar: ID de la categoría no definido");
      return;
    }

    deleteBrand.mutate(brand.id, {
      onSuccess: () => toast.success("Categoría eliminada"),
      onError: () => toast.error("Error al eliminar la categoría"),
    });
  };

  const mappedCat = data.map((tipo: CategoriaPag) => ({
    id: tipo.idCATEGORIA,
    descripcion: tipo.descripcion,
    esServicio: tipo.esServicio,
  }));

  return (
    <div className="w-full">
      <DataTable
        data={mappedCat}
        columns={[
          { accessorKey: "descripcion", header: "Categoría" },
          { accessorKey: "esServicio", header: "Servicio Cod" },
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
          setCurrentCat({ id: row.id, descripcion: row.descripcion, esServicio: row.esServicio });
          setDescripcion(row.descripcion);
          setEsServicio(row.esServicio);
        }}
        actions={<Button onClick={openAddModal}>Agregar Categoría</Button>}
      />

      {/* ----------------- MODAL ----------------- */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currenCat ? "Editar Categoría" : "Agregar Categoría"}</DialogTitle>
          </DialogHeader>

          <Input
            ref={inputRef}
            placeholder="Nombre de la Categoría"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="mb-4"
          />
          <Input
            type="number"
            placeholder="Servicio (0 = No, 1 = Sí)"
            value={esServicio}
            onChange={(e) => setEsServicio(Number(e.target.value))}
            className="mb-4"
          />

          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {currenCat ? "Actualizar" : "Agregar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
