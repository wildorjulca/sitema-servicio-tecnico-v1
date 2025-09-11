import { useUser } from "@/hooks/useUser";
import { useState, useEffect } from "react";
import { ServicioEquipo } from "@/interface";
import Loader from "@/components/sniper-carga/loader";
import { DataTable } from "../ui/table-reutilizable";
import { useAddServicioEqHook, useDeleteServicioEqHook, useEditServicioEqHook, useServicioEquipoHook } from "@/hooks/useServicioEquipo";
import { useMarcas } from "@/hooks/useMarcaHook";
import { SelectWithCheckbox } from "@/components/chexbox/SelectWithCheckbox";

import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { ServicioEquipoDialog } from "./ui/modal";

export default function Servicio_Equipos() {
  const { user } = useUser();
  const usuarioId = user?.id;

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [filtroMarca, setFiltroMarca] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentServicio, setCurrentServicio] = useState<ServicioEquipo | null>(null);

  // Hooks de datos
  const { data: marcasData, isLoading: isLoadingMarcas } = useMarcas();
  const { data, total, isLoading } = useServicioEquipoHook(
    usuarioId,
    pageIndex,
    pageSize,
    { filtroMarca }
  );

  // Hooks de mutación
  const addServicio = useAddServicioEqHook(usuarioId!);
  const editServicio = useEditServicioEqHook(usuarioId!);
  const deleteServicio = useDeleteServicioEqHook(usuarioId!);

  useEffect(() => {
    if (usuarioId && data) {
      setTotalRows(total);
    }
  }, [pageIndex, pageSize, usuarioId, total, data]);

  // Preparar las opciones para el Select
  const marcaOptions = marcasData.map(marca => ({
    value: marca.idMarca,
    label: marca.nombreMarca
  }));

  // Abrir modal para agregar
  const openAddModal = () => {
    setCurrentServicio(null);
    setDialogOpen(true);
  };

  // Abrir modal para editar
  const openEditModal = (serv: any) => {
    setCurrentServicio(serv);
    setDialogOpen(true);
  };

  // Manejar submit del modal
  const handleSubmit = (formData: any) => {
    if (currentServicio) {
      // Editar
      editServicio.mutate(
        { 
          idServicioEquipos: currentServicio.idServicioEquipos!,
          ...formData
        },
        { 
          onSuccess: () => {
            toast.success("Servicio equipo actualizado");
          },
          onError: () => toast.error("Error al actualizar servicio equipo")
        }
      );
    } else {
      // Agregar
      addServicio.mutate(
        formData,
        { 
          onSuccess: () => {
            toast.success("Servicio equipo agregado");
          },
          onError: () => toast.error("Error al agregar servicio equipo")
        }
      );
    }
    setDialogOpen(false);
  };

  // Eliminar servicio equipo
  const handleDelete = (serv: any) => {
    if (!serv.idServicioEquipos) {
      toast.error("No se puede eliminar: ID no definido");
      return;
    }

    deleteServicio.mutate(serv.idServicioEquipos, {
      onSuccess: () => toast.success("Servicio equipo eliminado"),
      onError: () => toast.error("Error al eliminar servicio equipo"),
    });
  };

  if (!usuarioId) return <div>Por favor inicia sesión para ver los equipos</div>;
  if (isLoadingMarcas || isLoading) return <div><Loader /></div>;

  const mappedServicioE = data.map((se: ServicioEquipo) => ({
    idServicioEquipos: se.idServicioEquipos,
    nombre_equipo: se.nombre_equipo,
    nombre_marca: se.nombre_marca,
    modelo: se.modelo,
    serie: se.serie,
    codigo_barras: se.codigo_barras,
    EQUIPO_idEquipo: se.EQUIPO_idEquipo,
    MARCA_idMarca: se.MARCA_idMarca
  }));

  return (
    <div className="w-full space-y-2">
      {/* --- Filtros --- */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <SelectWithCheckbox
          value={filtroMarca}
          onValueChange={(value) => {
            setPageIndex(0);
            setFiltroMarca(value as number | null);
          }}
          options={marcaOptions}
          label="Filtrar por Marca :"
          placeholder="Seleccionar marca"
        />
      </div>

      {/* --- Tabla --- */}
      <DataTable
        data={mappedServicioE}
        columns={[
          { accessorKey: "nombre_equipo", header: "Equipo" },
          { accessorKey: "nombre_marca", header: "Marca" },
          { accessorKey: "modelo", header: "Modelo" },
          { accessorKey: "serie", header: "Serie" },
          { accessorKey: "codigo_barras", header: "Cod" },
        ]}
        pageIndex={pageIndex}
        pageSize={pageSize}
        searchColumn="nombre_equipo"
        totalRows={totalRows}
        onPageChange={(newPage) => setPageIndex(newPage)}
        onPageSizeChange={(size) => setPageSize(size)}
        onEdit={openEditModal}
        onDelete={handleDelete}
        actions={<Button onClick={openAddModal}>Agregar Servicio Equipo</Button>}
      />

      {/* ----------------- MODAL DIALOG ----------------- */}
      <ServicioEquipoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        servicioEquipo={currentServicio}
        onSubmit={handleSubmit}
      />
    </div>
  );
}