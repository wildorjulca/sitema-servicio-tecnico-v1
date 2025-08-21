import { useBrands, useAddBrand, useEditBrand, useDeleteBrand } from "@/hooks/useMarcaHook";
import { DataTable } from "../ui/table-reutilizable";
import { useUser } from "@/hooks/useUser";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

export function Marca() {
  const { user } = useUser();
  const usuarioId = user?.id;

  const { data: marcas, isLoading, isError } = useBrands(usuarioId);
  const addBrand = useAddBrand(usuarioId!);
  const editBrand = useEditBrand(usuarioId!);
  const deleteBrand = useDeleteBrand(usuarioId!);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentBrand, setCurrentBrand] = useState<BrandType | null>(null);
  const [brandName, setBrandName] = useState("");

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
  const openEditModal = (brand: BrandType) => {
    setCurrentBrand(brand);
    setBrandName(brand.nombre);
    setDialogOpen(true);
  };

  // Guardar cambios
  const handleSave = () => {
    if (!brandName.trim()) {
      toast.error("El nombre no puede estar vacío");
      return;
    }

    if (currentBrand) {
      editBrand.mutate({ ...currentBrand, nombre: brandName, usuarioId });
    } else {
      addBrand.mutate({ nombre: brandName, usuarioId });
    }

    setDialogOpen(false);
  };

  // Eliminar marca
  const handleDelete = (brand: BrandType) => {
    deleteBrand.mutate(brand.id);
  };

  return (
    <div className="w-full">


      <DataTable
        data={marcas}
        columns={[
          { accessorKey: "nombre", header: "Nombre" },
        ]}
        searchColumn="nombre"
        placeholderSearch="Buscar marcas..."
        onEdit={openEditModal}
        onDelete={handleDelete}
        actions={
          <Button onClick={openAddModal}>Agregar Marca</Button>
        }
      />

      {/* ----------------- MODAL DIALOG ----------------- */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentBrand ? "Editar Marca" : "Agregar Marca"}</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Nombre de la marca"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            className="mb-4"
          />

          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{currentBrand ? "Actualizar" : "Agregar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
