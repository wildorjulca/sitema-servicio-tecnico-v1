import { useBrands } from "@/hooks/useMarcaHook";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../ui/table-reutilizable";
import { useUser } from "@/hooks/useUser";

// Define el tipo según lo que devuelve tu API
export type BrandType = {
  id: number;
  nombre: string;
  estado: string;
};

// Columnas de la tabla
const columns: ColumnDef<BrandType>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
];

interface MarcaProps {
  onEdit?: (row: BrandType) => void;
  onDelete?: (row: BrandType) => void;
  onUpdate?: (row: BrandType) => void;
}
export function Marca({ onEdit, onDelete, onUpdate }: MarcaProps) {
  const { user } = useUser(); // obtenemos el usuario logueado
  const usuarioId = user?.id;

  const { data: marcas, isLoading, isError } = useBrands(usuarioId)

  if (!usuarioId) return <div>Por favor inicia sesión para ver tus marcas</div>;
  if (isLoading) return <div>Cargando marcas...</div>;
  if (isError) return <div>Error al cargar marcas</div>;

  return (
    <div className="w-full">
      <DataTable
        data={marcas}
        columns={columns}
        searchColumn="nombre"
        placeholderSearch="Buscar marcas..."
        onEdit={onEdit}
        onDelete={onDelete}
        onUpdate={onUpdate}
      />
    </div>
  );
}

