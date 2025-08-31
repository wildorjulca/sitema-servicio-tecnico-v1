import { DataTable } from "../ui/table-reutilizable";
import { useUser } from "@/hooks/useUser";
import { useState, useEffect } from "react";
import Loader from "@/components/sniper-carga/loader";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import toast from "react-hot-toast";
import { useAddClienteHook, useClienteHook, useDeleteClienteHook, useEditClienteHook } from "@/hooks/useCliente";
import { useTipoDocHook } from "@/hooks/useTipoDoc";
import { TipoDoc } from "@/apis";
import { ClienteFront, Clientes } from "@/interface";

interface ClienteRow {
  id: number;
  nombre: string;
  apellidos: string;
  tipo_doc_id: number | null;
  numero_doc: string;
  direccion: string;
  telefono: string;
}

export function Cliente() {
  const { user } = useUser();
  const usuarioId = user?.id;

  // Paginación
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  // Hooks API
  const { data, total, isLoading, isError, error, refetch } = useClienteHook(usuarioId, pageIndex, pageSize);
  const addCliente = useAddClienteHook(usuarioId!);
  const editCliente = useEditClienteHook(usuarioId!);
  const deleteCliente = useDeleteClienteHook(usuarioId!);
  const { data: tipo_doc } = useTipoDocHook(usuarioId);

  // Estado modal
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentCliente, setCurrentCliente] = useState<ClienteFront | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Campos del formulario
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [tipoDoc, setTipoDoc] = useState<number | null>(null);
  const [numero_documento, setNumeroDoc] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");

  // Refrescar
  useEffect(() => {
    if (usuarioId && data) {
      setTotalRows(total);
    }
  }, [data, total, usuarioId]);

  // Mapear clientes para la tabla
  const mappedClientes: ClienteRow[] = data?.map((c: Clientes) => ({
    id: c.idCliente,
    nombre: c.nombre,
    apellidos: c.apellidos,
    tipo_doc_id: c.tipo_doc_id,
    numero_doc: c.numero_documento.toString(),
    direccion: c.direccion,
    telefono: c.telefono?.toString() || "",
  })) || [];

  if (!usuarioId) return <div>Por favor inicia sesión para ver los clientes</div>;
  if (isLoading) return <div><Loader /></div>;
  if (isError) {
    console.error("Error details:", error);
    return <div>Error al cargar los clientes: {error?.message || "Unknown error"}</div>;
  }

  // Abrir modal para agregar
  const openAddModal = () => {
    setCurrentCliente(null);
    setNombre("");
    setApellidos("");
    setTipoDoc(null);
    setNumeroDoc("");
    setDireccion("");
    setTelefono("");
    setDialogOpen(true);
  };

  // Abrir modal para editar
  const openEditModal = (row: ClienteRow) => {
    const clienteCompleto = data?.find((c: Clientes) => c.idCliente === row.id);

    if (!clienteCompleto) {
      toast.error("Cliente no encontrado");
      return;
    }

    setCurrentCliente(clienteCompleto);
    setNombre(clienteCompleto.nombre);
    setApellidos(clienteCompleto.apellidos);
    setTipoDoc(clienteCompleto.tipo_doc_id);
    setNumeroDoc(clienteCompleto.numero_documento.toString());
    setDireccion(clienteCompleto.direccion);
    setTelefono(clienteCompleto.telefono?.toString() || "");
    setDialogOpen(true);
  };

  // Función para convertir seguro a número - CORREGIDO
  const safeParseInt = (value: string): number | null => {
    if (!value || value.trim() === '') return null;
    const parsed = parseInt(value.replace(/\D/g, ''), 10);
    return isNaN(parsed) ? null : parsed;
  };

  // Guardar cambios - CORREGIDO
  const handleSave = async () => {
    if (!nombre || !apellidos || tipoDoc === null || !numero_documento || !usuarioId) {
      toast.error("Faltan campos obligatorios");
      return;
    }

    // Validar número de documento
    const numeroDocParsed = safeParseInt(numero_documento);
    if (numeroDocParsed === null) {
      toast.error("Número de documento inválido");
      return;
    }

    // Validar teléfono si se proporcionó
    let telefonoParsed: number | null = null;
    if (telefono.trim() !== '') {
      telefonoParsed = safeParseInt(telefono);
      if (telefonoParsed === null) {
        toast.error("Teléfono inválido");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const tipoDocSeleccionado = tipo_doc?.find((t: TipoDoc) => t.id_tipo === tipoDoc);

      if (!tipoDocSeleccionado) {
        toast.error("Tipo de documento no válido");
        return;
      }

      // PAYLOAD CORREGIDO - Conversiones seguras
      const payload: any = {
        // Solo incluir idCliente si estamos editando y tiene valor
        ...(currentCliente?.idCliente && { idCliente: currentCliente.idCliente }),
        nombre,
        apellidos,
        tipo_doc_id: tipoDoc,
        cod_tipo: tipoDocSeleccionado.cod_tipo,
        numero_documento: numeroDocParsed, // Usar el valor ya convertido
        direccion,
        ...(telefonoParsed !== null && { telefono: telefonoParsed }), // Solo incluir si tiene valor
        usuarioId,
      };

      // Limpiar propiedades undefined o null
      Object.keys(payload).forEach(key => {
        if (payload[key] === undefined || payload[key] === null) {
          delete payload[key];
        }
      });

      console.log("Enviando payload:", payload);

      if (currentCliente) {
        await editCliente.mutateAsync(payload);
        toast.success("Cliente actualizado");
      } else {
        await addCliente.mutateAsync(payload);
        toast.success("Cliente creado");
      }

      setDialogOpen(false);
      refetch();
    } catch (error: any) {
      console.error("Error completo:", error);
      const errorMessage = error.response?.data?.error || error.response?.data?.mensaje || "Error desconocido";
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Eliminar
  const handleDelete = (row: ClienteRow) => {
    if (!row.id) {
      toast.error("No se puede eliminar: ID no definido");
      return;
    }
    deleteCliente.mutate(row.id, {
      onSuccess: () => {
        toast.success("Cliente eliminado");
        refetch();
      },
      onError: (error: any) => {
        const errorMessage = error.response?.data?.error || error.response?.data?.mensaje || "Error desconocido";
        toast.error(`Error al eliminar cliente: ${errorMessage}`);
      },
    });
  };

  return (
    <div className="w-full">
      <DataTable
        data={mappedClientes}
        columns={[
          { accessorKey: "nombre", header: "Nombre" },
          { accessorKey: "apellidos", header: "Apellidos" },
          {
            accessorKey: "tipo_doc_id",
            header: "Tipo Doc",
            cell: ({ row }) => {
              // CORRECCIÓN: Verificar si tipo_doc_id es null o undefined
              if (row.original.tipo_doc_id === null || row.original.tipo_doc_id === undefined) {
                return "No seleccionado";
              }

              const tipoDocItem = tipo_doc?.find((t: TipoDoc) => t.id_tipo === row.original.tipo_doc_id);
              return tipoDocItem ? tipoDocItem.nombre_tipo : "No encontrado";
            }
          },
          { accessorKey: "numero_doc", header: "N° Documento" },
          { accessorKey: "direccion", header: "Dirección" },
          { accessorKey: "telefono", header: "Teléfono" },
        ]}
        searchColumn="nombre"
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalRows={totalRows}
        onPageChange={(newPage) => setPageIndex(newPage)}
        onPageSizeChange={(size) => setPageSize(size)}
        onEdit={openEditModal}
        onDelete={handleDelete}
        actions={<Button onClick={openAddModal}>Agregar Cliente</Button>}
      />

      {/* Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentCliente ? "Editar Cliente" : "Agregar Cliente"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input placeholder="Nombre *" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <Input placeholder="Apellidos *" value={apellidos} onChange={(e) => setApellidos(e.target.value)} />

            <Select
              value={tipoDoc?.toString() || ""}
              onValueChange={(v) => setTipoDoc(v ? Number(v) : null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo documento *" />
              </SelectTrigger>
              <SelectContent>
                {tipo_doc?.map((cat: TipoDoc) => (
                  <SelectItem key={cat.id_tipo} value={cat.id_tipo.toString()}>
                    {cat.nombre_tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="N° Documento *"
              value={numero_documento}
              onChange={(e) => setNumeroDoc(e.target.value.replace(/\D/g, ''))}
              type="text" // Cambiado a text para mejor control
              inputMode="numeric"
            />
            <Input placeholder="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
            <Input
              placeholder="Teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ''))}
              type="text" // Cambiado a text para mejor control
              inputMode="tel"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting ? "Procesando..." : (currentCliente ? "Actualizar" : "Agregar")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}