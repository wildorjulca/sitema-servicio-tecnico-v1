import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import EditProfileModal from "./EditProfileModal"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ConfirmPasswordModal = ({ open, onOpenChange }: Props) => {
  const [password, setPassword] = useState("")
  const [openEdit, setOpenEdit] = useState(false)

  const handleConfirm = () => {
    // Aquí validas la contraseña (ej: API backend)
    if (password.trim() === "123456") {
      onOpenChange(false)
      setOpenEdit(true)
    } else {
      alert("Contraseña incorrecta")
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Identidad</DialogTitle>
          </DialogHeader>
          <Input
            type="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <DialogFooter>
            <Button onClick={handleConfirm}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de edición */}
      <EditProfileModal open={openEdit} onOpenChange={setOpenEdit} />
    </>
  )
}

export default ConfirmPasswordModal
