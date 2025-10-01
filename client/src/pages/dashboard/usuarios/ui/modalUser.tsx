import { useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import toast from "react-hot-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { usuarioCreateSchema, UsuarioFormData, usuarioUpdateSchema } from "@/lib/zods"
import { useRolHook } from "@/hooks/useRol"

interface UsuarioModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave: (usuario: any) => void
    currentUsuario?: any | null
    usuarioId: number
    isSubmitting?: boolean
}

export default function UsuarioModal({
    open,
    onOpenChange,
    onSave,
    currentUsuario,
    usuarioId,
    isSubmitting = false
}: UsuarioModalProps) {
    // Usar el hook de roles
    const { data: roles, isLoading: isLoadingRoles } = useRolHook(usuarioId)

    const form = useForm<UsuarioFormData>({
        resolver: zodResolver(currentUsuario ? usuarioUpdateSchema : usuarioCreateSchema),
        defaultValues: {
            nombre: "",
            apellidos: "",
            dni: "",
            telefono: undefined,
            usuario: "",
            password: "",
            rol_id: undefined,
            usuarioId: usuarioId,
            id: undefined
        }
    })

    // Resetear formulario cuando se abre/cierra el modal o cambia el currentUsuario
    useEffect(() => {
        if (open) {
            if (currentUsuario) {
                form.reset({
                    nombre: currentUsuario.nombre || "",
                    apellidos: currentUsuario.apellidos || "",
                    dni: currentUsuario.dni?.toString() || "",
                    telefono: currentUsuario.telefono || undefined,
                    usuario: currentUsuario.usuario || "",
                    password: "", // No prellenar password por seguridad
                    rol_id: currentUsuario.rol_id || undefined,
                    usuarioId: usuarioId,
                    id: currentUsuario.id || undefined
                })
            } else {
                form.reset({
                    nombre: "",
                    apellidos: "",
                    dni: "",
                    telefono: undefined,
                    usuario: "",
                    password: "",
                    rol_id: undefined,
                    usuarioId: usuarioId,
                    id: undefined
                })
            }
        }
    }, [open, currentUsuario, form, usuarioId])

    // Función para manejar el input del DNI y limitar a 8 caracteres
    const handleDniChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 8); // Solo números y máximo 8
        field.onChange(value);
    }

    // Función para manejar el input del teléfono
    const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
        const value = e.target.value.replace(/\D/g, ''); // Solo números
        field.onChange(value ? parseInt(value) : undefined);
    }

    const onSubmit = async (data: UsuarioFormData) => {
        try {
            // Preparar payload - convertir DNI a número para el backend
            const payload = {
                ...data,
                dni: parseInt(data.dni), // Convertir a número para el backend
                // Limpiar campos undefined
                ...(data.telefono === undefined && { telefono: undefined }),
                ...(currentUsuario && !data.password && { password: undefined }) // No enviar password vacío en updates
            }

            onSave(payload)
        } catch (error) {
            toast.error("Error al procesar el formulario")
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl ">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        {currentUsuario ? "Editar Usuario" : "Agregar Usuario"}
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
                                            <Input
                                                placeholder="Ingrese el nombre"
                                                {...field}
                                                className="w-full"
                                            />
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
                                            <Input
                                                placeholder="Ingrese los apellidos"
                                                {...field}
                                                className="w-full"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="dni"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>DNI *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ingrese el DNI"
                                                type="text"
                                                inputMode="numeric"
                                                {...field}
                                                onChange={(e) => handleDniChange(e, field)}
                                                value={field.value || ''}
                                                className="w-full"
                                            />
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
                                                className="w-full"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="usuario"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Usuario *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ingrese el nombre de usuario"
                                                {...field}
                                                className="w-full"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Contraseña {!currentUsuario && "*"}
                                            {currentUsuario && " (dejar vacío para no cambiar)"}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Ingrese la contraseña"
                                                {...field}
                                                value={field.value || ''}
                                                className="w-full"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>


                        <FormField
                            control={form.control}
                            name="rol_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rol *</FormLabel>
                                    <Select
                                        value={field.value?.toString() || ""}
                                        onValueChange={(v) => field.onChange(Number(v))}
                                        disabled={isLoadingRoles}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder={
                                                    isLoadingRoles ? "Cargando roles..." : "Seleccione un rol"
                                                } />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {roles?.map((rol) => (
                                                <SelectItem key={rol.id} value={rol.id.toString()}>
                                                    {rol.tipo_rol}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isSubmitting}
                                className="mr-2"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting || isLoadingRoles}
                                className="min-w-24"
                            >
                                {isSubmitting ? "Procesando..." : (currentUsuario ? "Actualizar" : "Agregar")}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}