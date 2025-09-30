// components/motivo-ingreso/MotivoIngreso.tsx
import { DataTable } from "../ui/table-reutilizable";
import { useUser } from "@/hooks/useUser";
import { useState, useEffect } from "react";
import { MotivoIngresoPag } from "@/interface";
import Loader from "@/components/sniper-carga/loader";
import { useAddMotivoIngreso, useDeleteMotivoIngreso, useEditMotivoIngreso, useMotivoIngresoHook } from "@/hooks/useMotivoIngreso";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { MotivoIngresoModal } from "./ui/MotivoIngresoModal";

interface Mot {
  id: number;
  descripcion: string;
  precio_cobrar: number;
  usuarioId?: number;
}

export function Motivo_Ingreso() {
  const { user } = useUser();
  const usuarioId = user?.id;

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

  useEffect(() => {
    if (usuarioId && data) {
      console.log("Datos de useTipoDocHook:", { data, total });
      setTotalRows(total);
      refetch();
    }
  }, [pageIndex, pageSize, usuarioId, total, refetch]);

  if (!usuarioId) return <div>Por favor inicia sesión para ver los motivos de Ingreso</div>;
  if (isLoading) return <div><Loader /></div>;
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
    setCurrentBrand({ 
      id: brand.id, 
      descripcion: brand.descripcion, 
      precio_cobrar: brand.precio_cobrar, 
      usuarioId 
    });
    setDescripcion(brand.descripcion);
    setPrecio_cobrar(brand.precio_cobrar.toString());
    setDialogOpen(true);
  };

  // Guardar cambios
  const handleSave = () => {
    if (!descripcion.trim()) {
      toast.error("El nombre no puede estar vacío");
      return;
    }

    const precioNumber = parseFloat(precio_cobrar) || 0;

    if (currentBrand) {
      editBrand.mutate(
        { 
          id: currentBrand.id, 
          descripcion, 
          precio_cobrar: precioNumber, 
          usuarioId 
        },
        { 
          onSuccess: () => {
            setDialogOpen(false);
            toast.success("Motivo actualizado correctamente");
          },
          onError: () => toast.error("Error al actualizar el motivo")
        }
      );
    } else {
      addBrand.mutate(
        { 
          descripcion, 
          precio_cobrar: precioNumber, 
          usuarioId 
        },
        { 
          onSuccess: () => {
            setDialogOpen(false);
            toast.success("Motivo agregado correctamente");
          },
          onError: () => toast.error("Error al agregar el motivo")
        }
      );
    }
  };

  // Eliminar motivo
  const handleDelete = (brand: Mot) => {
    if (!brand.id) {
      toast.error("No se puede eliminar: ID del motivo no definido");
      return;
    }

    deleteBrand.mutate(brand.id, {
      onSuccess: () => toast.success("Motivo eliminado"),
      onError: () => toast.error("Error al eliminar el motivo"),
    });
  };

  // Mapear motivos para la tabla
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
          setCurrentBrand({ 
            id: row.id, 
            descripcion: row.descripcion, 
            precio_cobrar: row.precio_cobrar 
          });
          setDescripcion(row.descripcion);
        }}
        actions={<Button onClick={openAddModal}>Agregar Motivo</Button>}
      />

      {/* Modal Component */}
      <MotivoIngresoModal
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        currentBrand={currentBrand}
        descripcion={descripcion}
        precio_cobrar={precio_cobrar}
        onDescripcionChange={setDescripcion}
        onPrecioCobrarChange={setPrecio_cobrar}
        onSave={handleSave}
        isSaving={addBrand.isPending || editBrand.isPending}
      />
    </div>
  );
}