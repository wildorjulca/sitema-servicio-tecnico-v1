import { useBrands, useAddBrand, useEditBrand, useDeleteBrand } from "@/hooks/useMarcaHook";
import { DataTable } from "../ui/table-reutilizable";
import { useUser } from "@/hooks/useUser";
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useEnterKey } from "@/utils/hotkeys";

interface Marca {
  id: number;
  nombre: string;
  usuarioId?: number;
}

export function Marca() {
  const { user } = useUser();
  const usuarioId = user?.id;

  const inputRef = useRef<HTMLInputElement>(null);

  // Paginación
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0); // Estado para el total de registros

  const { data, total, isLoading, isError, refetch } = useBrands(usuarioId, pageIndex, pageSize);

  const addBrand = useAddBrand(usuarioId!);
  const editBrand = useEditBrand(usuarioId!);
  const deleteBrand = useDeleteBrand(usuarioId!);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentBrand, setCurrentBrand] = useState<Marca | null>(null);
  const [brandName, setBrandName] = useState("");

  // Activar Enter para guardar
  useEnterKey(handleSave, inputRef, dialogOpen);

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

  // Abrir modal para agregar
  const openAddModal = () => {
    setCurrentBrand(null);
    setBrandName("");
    setDialogOpen(true);
  };

  // Abrir modal para editar
  const openEditModal = (brand: Marca) => {
    setCurrentBrand({ id: brand.id, nombre: brand.nombre, usuarioId });
    setBrandName(brand.nombre);
    setDialogOpen(true);
  };

  // Guardar cambios
  function handleSave() {
    if (!brandName.trim()) {
      toast.error("El nombre no puede estar vacío");
      return;
    }

    if (currentBrand) {
      editBrand.mutate(
        { id: currentBrand.id, nombre: brandName, usuarioId },
        { onSuccess: () => setDialogOpen(false) }
      );
    } else {
      addBrand.mutate(
        { nombre: brandName, usuarioId },
        { onSuccess: () => setDialogOpen(false) }
      );
    }
  }

  // Eliminar marca
  const handleDelete = (brand: Marca) => {
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
  const mappedMarcas = data.map((m: { idMarca: number; nombre: string; usuarioId?: number }) => ({
    id: m.idMarca,
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
        onEdit={openEditModal}
        onDelete={handleDelete}
        onRowSelect={(row) => {
          setCurrentBrand({ id: row.id, nombre: row.nombre });
          setBrandName(row.nombre);
        }}
        actions={<Button onClick={openAddModal}>Agregar Marca</Button>}
      />

      {/* ----------------- MODAL ----------------- */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentBrand ? "Editar Marca" : "Agregar Marca"}</DialogTitle>
          </DialogHeader>

          <Input
            ref={inputRef}
            placeholder="Nombre de la marca"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
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