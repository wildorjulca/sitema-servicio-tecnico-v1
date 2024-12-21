import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import clsx from "clsx"
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
import { clienteSchema } from "@/lib/zods"
import { z } from "zod"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { createCliente } from "@/services/clienteService"


const ModalFormCliente = () => {
    console.log("se redenrizo...")

    const form = useForm<z.infer<typeof clienteSchema>>({
        resolver: zodResolver(clienteSchema),
        defaultValues: {
            nombre: "",
            TIPO_DOCUMENTO_cod_tipo: "",
            numero_documento: "",
            direccion: "",
            telefono: ""
        },
    })

    async function onSubmit(values: z.infer<typeof clienteSchema>) {
        console.log(values)
        const response = await createCliente(values)
        console.log(response)
    }

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="default" size="default">Agregar usuario</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Nuevo cliente</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="nombre"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ingrese el nombre" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="TIPO_DOCUMENTO_cod_tipo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tipo documento</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Seleccionar" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="numero_documento"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Docuento</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Numero documento" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="direccion"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Direccion</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ingresar su direccion" {...field} />
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
                                        <FormLabel>Telefono</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ingresar el telefono" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-end space-x-4">
                                <DialogClose asChild>
                                    <Button
                                        variant="outline"
                                        size="default"
                                        type="button"
                                    // onClick={onClose}
                                    >
                                        Cancelar
                                    </Button>
                                </DialogClose>

                                <Button variant="default" size="default">
                                    Guardar
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ModalFormCliente
