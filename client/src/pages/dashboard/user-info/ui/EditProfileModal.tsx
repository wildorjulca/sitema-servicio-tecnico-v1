import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const EditProfileModal = ({ open, onOpenChange }: Props) => {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    empresa: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = () => {
    console.log("Datos guardados:", form)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
          <Input name="correo" placeholder="Correo" value={form.correo} onChange={handleChange} />
          <Input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
          <Input name="empresa" placeholder="Empresa" value={form.empresa} onChange={handleChange} />
        </div>

        <DialogFooter>
          <Button onClick={handleSave}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditProfileModal
