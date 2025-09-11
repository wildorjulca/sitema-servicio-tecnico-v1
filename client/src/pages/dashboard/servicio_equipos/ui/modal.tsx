// components/ServicioEquipoDialog.tsx
"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ServicioEquipo } from "@/interface"
import { useMarcas } from "@/hooks/useMarcaHook"
import { useEquiposCboHook } from "@/hooks/useEquipoHook"

// Schema Zod para servicio equipo
const ServicioEquipoSchema = z.object({
    EQUIPO_idEquipo: z.number().int().positive({ message: "Selecciona un equipo" }),
    MARCA_idMarca: z.number().int().positive({ message: "Selecciona una marca" }),
    modelo: z.string().optional(),
    serie: z.string().optional(),
    codigo_barras: z.string().optional(),
})

type ServicioEquipoFormValues = z.infer<typeof ServicioEquipoSchema>

interface ServicioEquipoDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    servicioEquipo?: ServicioEquipo | null;
    onSubmit: (data: ServicioEquipoFormValues) => void;
}

export function ServicioEquipoDialog({
    open,
    onOpenChange,
    servicioEquipo,
    onSubmit
}: ServicioEquipoDialogProps) {
    const { data: marcasData, isLoading: isLoadingMarcas } = useMarcas();
    const { data: equiposData, isLoading: isLoadingEquipos } = useEquiposCboHook();

    const form = useForm<ServicioEquipoFormValues>({
        resolver: zodResolver(ServicioEquipoSchema),
        defaultValues: {
            EQUIPO_idEquipo: 0,
            MARCA_idMarca: 0,
            modelo: "",
            serie: "",
            codigo_barras: "",
        },
    })

    // Reset form cuando el servicio equipo cambia
    React.useEffect(() => {
        if (servicioEquipo && open) {
            form.reset({
                EQUIPO_idEquipo: servicioEquipo.EQUIPO_idEquipo || 0,
                MARCA_idMarca: servicioEquipo.MARCA_idMarca || 0,
                modelo: servicioEquipo.modelo || "",
                serie: servicioEquipo.serie || "",
                codigo_barras: servicioEquipo.codigo_barras || "",
            })
        } else if (open) {
            form.reset({
                EQUIPO_idEquipo: 0,
                MARCA_idMarca: 0,
                modelo: "",
                serie: "",
                codigo_barras: "",
            })
        }
    }, [servicioEquipo, form, open])

    const handleFormSubmit = (data: ServicioEquipoFormValues) => {
        onSubmit(data);
    }

    if (isLoadingMarcas || isLoadingEquipos) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[500px]">
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {servicioEquipo ? "Editar Servicio Equipo" : "Nuevo Servicio Equipo"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                        {/* Equipo y Marca */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Equipo */}
                            <FormField
                                control={form.control}
                                name="EQUIPO_idEquipo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Equipo *</FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(parseInt(value))}
                                            value={field.value?.toString()}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccionar equipo" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {equiposData.map((equipo) => (
                                                    <SelectItem
                                                        key={equipo.idEquipo}
                                                        value={equipo.idEquipo.toString()}
                                                    >
                                                        {equipo.nombreEquipo}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Marca */}
                            <FormField
                                control={form.control}
                                name="MARCA_idMarca"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Marca *</FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(parseInt(value))}
                                            value={field.value?.toString()}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccionar marca" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {marcasData.map((marca) => (
                                                    <SelectItem
                                                        key={marca.idMarca}
                                                        value={marca.idMarca.toString()}
                                                    >
                                                        {marca.nombreMarca}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Modelo */}
                        <FormField
                            control={form.control}
                            name="modelo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Modelo</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej: ThinkPad T480" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Serie y Código de Barras */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="serie"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>N° Serie</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej: 123456789" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="codigo_barras"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Código de Barras</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej: 987654321" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button type="submit" className="w-full">
                            {servicioEquipo ? "Actualizar" : "Guardar"} Servicio Equipo
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}