// components/customer-modal.tsx
'use client'

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useTipoDocHook } from "@/hooks/useTipoDoc"
import { TipoDoc } from "@/apis"
import { ClienteFront } from "@/interface"
import toast from "react-hot-toast"

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
  
  // Campos del formulario
  const [nombre, setNombre] = useState("")
  const [apellidos, setApellidos] = useState("")
  const [tipoDoc, setTipoDoc] = useState<number | null>(null)
  const [numero_documento, setNumeroDoc] = useState("")
  const [direccion, setDireccion] = useState("")
  const [telefono, setTelefono] = useState("")

  // Resetear formulario cuando se abre/cierra el modal o cambia el currentCustomer
  useEffect(() => {
    if (open) {
      if (currentCustomer) {
        setNombre(currentCustomer.nombre)
        setApellidos(currentCustomer.apellidos)
        setTipoDoc(currentCustomer.tipo_doc_id)
        setNumeroDoc(currentCustomer.numero_documento.toString())
        setDireccion(currentCustomer.direccion)
        setTelefono(currentCustomer.telefono?.toString() || "")
      } else {
        resetForm()
      }
    }
  }, [open, currentCustomer])

  const resetForm = () => {
    setNombre("")
    setApellidos("")
    setTipoDoc(null)
    setNumeroDoc("")
    setDireccion("")
    setTelefono("")
  }

  // Función para convertir seguro a número
  const safeParseInt = (value: string): number | null => {
    if (!value || value.trim() === '') return null
    const parsed = parseInt(value.replace(/\D/g, ''), 10)
    return isNaN(parsed) ? null : parsed
  }

  const handleSave = async () => {
    if (!nombre || !apellidos || tipoDoc === null || !numero_documento) {
      toast.error("Faltan campos obligatorios")
      return
    }

    // Validar número de documento
    const numeroDocParsed = safeParseInt(numero_documento)
    if (numeroDocParsed === null) {
      toast.error("Número de documento inválido")
      return
    }

    // Validar teléfono si se proporcionó
    let telefonoParsed: number | null = null
    if (telefono.trim() !== '') {
      telefonoParsed = safeParseInt(telefono)
      if (telefonoParsed === null) {
        toast.error("Teléfono inválido")
        return
      }
    }

    const tipoDocSeleccionado = tipo_doc?.find((t: TipoDoc) => t.id_tipo === tipoDoc)

    if (!tipoDocSeleccionado) {
      toast.error("Tipo de documento no válido")
      return
    }

    // Preparar payload
    const payload: any = {
      ...(currentCustomer?.idCliente && { idCliente: currentCustomer.idCliente }),
      nombre,
      apellidos,
      tipo_doc_id: tipoDoc,
      cod_tipo: tipoDocSeleccionado.cod_tipo,
      numero_documento: numeroDocParsed,
      direccion,
      ...(telefonoParsed !== null && { telefono: telefonoParsed }),
      usuarioId,
    }

    // Limpiar propiedades undefined o null
    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined || payload[key] === null) {
        delete payload[key]
      }
    })

    onSave(payload)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{currentCustomer ? "Editar Cliente" : "Agregar Cliente"}</DialogTitle>
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
            type="text"
            inputMode="numeric"
          />
          <Input placeholder="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
          <Input
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ''))}
            type="text"
            inputMode="tel"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? "Procesando..." : (currentCustomer ? "Actualizar" : "Agregar")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}