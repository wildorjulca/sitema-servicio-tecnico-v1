// components/cliente.tsx (simplificado)
import { DataTable } from "../ui/table-reutilizable"
import { useUser } from "@/hooks/useUser"
import { useState, useEffect } from "react"
import Loader from "@/components/sniper-carga/loader"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import { useAddClienteHook, useClienteHook, useDeleteClienteHook, useEditClienteHook } from "@/hooks/useCliente"
import { ClienteFront, Clientes } from "@/interface"
import CustomerModal from "./ui/CustomerModal "

interface ClienteRow {
  id: number
  nombre: string
  apellidos: string
  tipo_doc_id: number | null
  numero_doc: string
  direccion: string
  telefono: string
}

export function Cliente() {
  const { user } = useUser()
  const usuarioId = user?.id

  // Paginación
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalRows, setTotalRows] = useState(0)

  // Hooks API
  const { data, total, isLoading, isError, error, refetch } = useClienteHook(usuarioId, pageIndex, pageSize)
  const addCliente = useAddClienteHook(usuarioId!)
  const editCliente = useEditClienteHook(usuarioId!)
  const deleteCliente = useDeleteClienteHook(usuarioId!)

  // Estado modal
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentCliente, setCurrentCliente] = useState<ClienteFront | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Refrescar
  useEffect(() => {
    if (usuarioId && data) {
      setTotalRows(total)
    }
  }, [data, total, usuarioId])

  // Mapear clientes para la tabla
  const mappedClientes: ClienteRow[] = data?.map((c: Clientes) => ({
    id: c.idCliente,
    nombre: c.nombre,
    apellidos: c.apellidos,
    tipo_doc_id: c.tipo_doc_id,
    numero_doc: c.numero_documento.toString(),
    direccion: c.direccion,
    telefono: c.telefono?.toString() || "",
  })) || []

  if (!usuarioId) return <div>Por favor inicia sesión para ver los clientes</div>
  if (isLoading) return <div><Loader /></div>
  if (isError) {
    console.error("Error details:", error)
    return <div>Error al cargar los clientes: {error?.message || "Unknown error"}</div>
  }

  // Abrir modal para agregar
  const openAddModal = () => {
    setCurrentCliente(null)
    setDialogOpen(true)
  }

  // Abrir modal para editar
  const openEditModal = (row: ClienteRow) => {
    const clienteCompleto = data?.find((c: Clientes) => c.idCliente === row.id)

    if (!clienteCompleto) {
      toast.error("Cliente no encontrado")
      return
    }

    setCurrentCliente(clienteCompleto)
    setDialogOpen(true)
  }

  // Guardar cambios
  const handleSave = async (payload: any) => {
    setIsSubmitting(true)

    try {
      if (currentCliente) {
        await editCliente.mutateAsync(payload)
        toast.success("Cliente actualizado")
      } else {
        await addCliente.mutateAsync(payload)
        toast.success("Cliente creado")
      }

      setDialogOpen(false)
      refetch()
    } catch (error: any) {
      console.error("Error completo:", error)
      const errorMessage = error.response?.data?.error || error.response?.data?.mensaje || "Error desconocido"
      toast.error(`Error: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Eliminar
  const handleDelete = (row: ClienteRow) => {
    if (!row.id) {
      toast.error("No se puede eliminar: ID no definido")
      return
    }
    deleteCliente.mutate(row.id, {
      onSuccess: () => {
        toast.success("Cliente eliminado")
        refetch()
      },
      onError: (error: any) => {
        const errorMessage = error.response?.data?.error || error.response?.data?.mensaje || "Error desconocido"
        toast.error(`Error al eliminar cliente: ${errorMessage}`)
      },
    })
  }

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
              if (row.original.tipo_doc_id === null || row.original.tipo_doc_id === undefined) {
                return "No seleccionado"
              }
              // Nota: Aquí necesitarías pasar tipo_doc como prop o usar un hook
              return "Tipo documento" // Esto es temporal
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

      <CustomerModal
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        currentCustomer={currentCliente}
        usuarioId={usuarioId!}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}