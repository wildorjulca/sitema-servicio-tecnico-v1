import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import ConfirmPasswordModal from "./ui/ConfirmPasswordModal"
import { BadgeCheckIcon } from "lucide-react"

const Perfil = () => {
    const [openConfirm, setOpenConfirm] = useState(false)

    // Simulación: esto lo traes de tu hook / API
    const usuario = {
        nombre: "Juan",
        apellidos: "Pérez López",
        dni: "12345678",
        telefono: "987654321",
        usuario: "juanp",
        rol: "Administrador",
    }

    return (
        <div className="bg-gradient-to-br  p-8">
            {/* Header */}
            <div className=" shadow rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20 border-4 border-primary/20">
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${usuario.nombre}+${usuario.apellidos}`} />
                        <AvatarFallback>{usuario.nombre[0]}{usuario.apellidos[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-2xl font-bold">{usuario.nombre} {usuario.apellidos}</h1>
                        <p className="text-muted-foreground">@{usuario.usuario}</p>
                        <span className="text-sm font-bold text-gray-800 font-sans mt-2 flex items-center gap-1">
                            <BadgeCheckIcon color="green" size={20} /> {usuario.rol}
                        </span>
                    </div>
                </div>
                <Button onClick={() => setOpenConfirm(true)}>Editar Perfil</Button>
            </div>

            <Separator className="my-6" />

            {/* Info en grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="flex items-center">
                        <CardTitle>Información Personal</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between">
                            <strong >Nombre:</strong>
                            <p className="w-2/3">{usuario.nombre}</p>
                        </div>
                        <div className="flex justify-between">
                            <strong >Apellidos:</strong>
                            <p className="w-2/3">{usuario.apellidos}</p>
                        </div>
                        <div className="flex justify-between">
                            <strong >DNI:</strong>
                            <p className="w-2/3">{usuario.dni}</p>
                        </div>
                        <div className="flex justify-between">
                            <strong >Teléfono:</strong>
                            <p className="w-2/3">{usuario.telefono}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex items-center">
                        <CardTitle>Cuenta</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between">
                            <strong >Usuario:</strong>
                            <p className="w-2/3">{usuario.usuario}</p>
                        </div>
                        <div className="flex justify-between">
                            <strong >Rol:</strong>
                            <p className="w-2/3">{usuario.rol}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Seguridad</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-between items-center">
                        <p>Último cambio de contraseña : <span className="text-blue-600 font-semibold">hace 2 meses</span></p>
                        <Button variant="outline">Cambiar contraseña</Button>
                    </CardContent>
                </Card>
            </div>

            {/* Modal confirmación */}
            <ConfirmPasswordModal open={openConfirm} onOpenChange={setOpenConfirm} />
        </div>
    )
}

export default Perfil
