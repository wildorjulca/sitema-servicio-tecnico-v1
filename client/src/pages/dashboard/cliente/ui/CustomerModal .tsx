import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useTipoDocHook } from "@/hooks/useTipoDoc"
import { TipoDoc } from "@/apis"
import { ClienteFront } from "@/interface"
import toast from "react-hot-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { clienteSchema, ClienteFormData } from "@/lib/zods"

interface CustomerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (cliente: any) => void
  currentCustomer?: ClienteFront | null
  usuarioId: number
  isSubmitting?: boolean
}

export default function CustomerModal({ 
  open, 
  onOpenChange, 
  onSave, 
  currentCustomer, 
  usuarioId, 
  isSubmitting = false 
}: CustomerModalProps) {
  const { data: tipo_doc } = useTipoDocHook(usuarioId)
  const [selectedTipoDoc, setSelectedTipoDoc] = useState<TipoDoc | null>(null)

  const form = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nombre: "",
      apellidos: "",
      tipo_doc_id: undefined,
      numero_documento: "",
      direccion: "",
      telefono: undefined,
      usuarioId: usuarioId,
      idCliente: undefined
    }
  })

  // Observar cambios en el tipo de documento para validación dinámica
  const watchTipoDocId = form.watch("tipo_doc_id")

  useEffect(() => {
    if (watchTipoDocId && tipo_doc) {
      const tipoDocSeleccionado = tipo_doc.find((t: TipoDoc) => t.id_tipo === watchTipoDocId)
      setSelectedTipoDoc(tipoDocSeleccionado || null)
      
      // Actualizar validación del número de documento
      if (tipoDocSeleccionado) {
        const numeroDocumento = form.getValues("numero_documento")
        if (numeroDocumento) {
          form.trigger("numero_documento")
        }
      }
    } else {
      setSelectedTipoDoc(null)
    }
  }, [watchTipoDocId, tipo_doc, form])

  // Resetear formulario cuando se abre/cierra el modal o cambia el currentCustomer
  useEffect(() => {
    if (open) {
      if (currentCustomer) {
        const tipoDocSeleccionado = tipo_doc?.find((t: TipoDoc) => t.id_tipo === currentCustomer.tipo_doc_id)
        setSelectedTipoDoc(tipoDocSeleccionado || null)
        
        form.reset({
          nombre: currentCustomer.nombre || "",
          apellidos: currentCustomer.apellidos || "",
          tipo_doc_id: currentCustomer.tipo_doc_id || undefined,
          numero_documento: currentCustomer.numero_documento?.toString() || "",
          direccion: currentCustomer.direccion || "",
          telefono: currentCustomer.telefono || undefined,
          usuarioId: usuarioId,
          idCliente: currentCustomer.idCliente || undefined
        })
      } else {
        setSelectedTipoDoc(null)
        form.reset({
          nombre: "",
          apellidos: "",
          tipo_doc_id: undefined,
          numero_documento: "",
          direccion: "",
          telefono: undefined,
          usuarioId: usuarioId,
          idCliente: undefined
        })
      }
    }
  }, [open, currentCustomer, form, usuarioId, tipo_doc])

  // Función de validación personalizada para el número de documento
  const validateNumeroDocumento = (value: string) => {
    if (!selectedTipoDoc) return true // Si no hay tipo seleccionado, no validar
    
    const digitCount = selectedTipoDoc.cant_digitos
    const cleanValue = value.replace(/\D/g, '')
    
    if (cleanValue.length !== digitCount) {
      return `El ${selectedTipoDoc.nombre_tipo} debe tener exactamente ${digitCount} dígitos`
    }
    
    return true
  }

  const onSubmit = async (data: ClienteFormData) => {
    try {
      // Validación adicional del número de documento
      if (selectedTipoDoc) {
        const digitCount = selectedTipoDoc.cant_digitos
        const cleanNumeroDoc = data.numero_documento.replace(/\D/g, '')
        
        if (cleanNumeroDoc.length !== digitCount) {
          toast.error(`El ${selectedTipoDoc.nombre_tipo} debe tener exactamente ${digitCount} dígitos`)
          return
        }
      }

      const tipoDocSeleccionado = tipo_doc?.find((t: TipoDoc) => t.id_tipo === data.tipo_doc_id)

      if (!tipoDocSeleccionado) {
        toast.error("Tipo de documento no válido")
        return
      }

      // Preparar payload
      const payload = {
        ...data,
        numero_documento: parseInt(data.numero_documento),
        cod_tipo: tipoDocSeleccionado.cod_tipo,
        // Limpiar campos undefined
        ...(data.telefono === undefined && { telefono: undefined }),
        ...(data.direccion === "" && { direccion: undefined }),
        ...(!data.idCliente && { idCliente: undefined })
      }

      onSave(payload)
    } catch (error) {
      toast.error("Error al procesar el formulario")
    }
  }

  // Función para manejar el input del número de documento
  const handleNumeroDocChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const value = e.target.value.replace(/\D/g, '')
    
    // Limitar la longitud según el tipo de documento seleccionado
    if (selectedTipoDoc) {
      const maxLength = selectedTipoDoc.cant_digitos
      field.onChange(value.slice(0, maxLength))
    } else {
      field.onChange(value)
    }
  }

  // Función para manejar el input del teléfono
  const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const value = e.target.value.replace(/\D/g, '')
    field.onChange(value ? parseInt(value) : undefined)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {currentCustomer ? "Editar Cliente" : "Agregar Cliente"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese el nombre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="apellidos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellidos *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese los apellidos" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tipo_doc_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Documento *</FormLabel>
                    <Select
                      value={field.value?.toString() || ""}
                      onValueChange={(v) => field.onChange(Number(v))}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo documento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tipo_doc?.map((cat: TipoDoc) => (
                          <SelectItem key={cat.id_tipo} value={cat.id_tipo.toString()}>
                            {cat.cod_tipo} ({cat.cant_digitos} dígitos)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numero_documento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      N° Documento *
                      {selectedTipoDoc && (
                        <span className="text-xs text-gray-500 ml-2">
                          ({selectedTipoDoc.cant_digitos} dígitos)
                        </span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          selectedTipoDoc 
                            ? `Ingrese ${selectedTipoDoc.nombre_tipo}`
                            : "Ingrese número de documento"
                        }
                        type="text"
                        inputMode="numeric"
                        {...field}
                        onChange={(e) => handleNumeroDocChange(e, field)}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                    {selectedTipoDoc && field.value && (
                      <div className="text-xs text-gray-500">
                        {field.value.replace(/\D/g, '').length}/{selectedTipoDoc.cant_digitos} dígitos
                      </div>
                    )}
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="direccion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingrese la dirección" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telefono"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingrese el teléfono"
                      type="text"
                      inputMode="numeric"
                      {...field}
                      onChange={(e) => handleTelefonoChange(e, field)}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Procesando..." : (currentCustomer ? "Actualizar" : "Agregar")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}