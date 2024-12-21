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

interface Props {
    isOpen: boolean,
    onClose: () => void
}
const ModalFormCliente = ({ isOpen, onClose }: Props) => {

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

    function onSubmit(values: z.infer<typeof clienteSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }
    return (
        <>
            {/* Fondo del modal */}
            <div
                className={clsx(
                    'fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center transition-opacity transform',
                    {
                        'opacity-100 scale-100 pointer-events-auto': isOpen,
                        'opacity-0 scale-95 pointer-events-none': !isOpen,
                    }
                )}
                onClick={onClose}
            >
                {/* Contenedor del modal */}
                <div
                    className="relative p-5 w-full max-w-md bg-white rounded-lg shadow-lg transition-transform"
                    onClick={(e) => e.stopPropagation()} // Evita cerrar el modal al hacer clic dentro
                >
                    {/* Encabezado del modal */}
                    <div className="flex items-center justify-between pb-4 border-b">
                        <h3 className="text-lg font-semibold text-gray-900">Agregar Nuevo Cliente</h3>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 rounded-lg focus:outline-none"
                        >
                            <svg
                                className="w-4 h-4"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 14"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M1 1l12 12M13 1L1 13"
                                />
                            </svg>
                        </button>
                    </div>

                    <div className="max-h-[80vh] overflow-y-auto px-4 custom-scrollbar">
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
                                    <Button
                                        variant="outline"
                                        size="default"
                                        type="button"
                                        onClick={onClose}>
                                        Cancelar
                                    </Button>
                                    <Button variant="default" size="default">
                                        Guardar
                                    </Button>
                                </div>
                            </form>
                        </Form>

                    </div>


                    {/* Contenido del formulario */}
                    {/* <form className="pt-4 space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Type product name"
                                className="w-full mt-1 border rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                    Price
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    placeholder="$2999"
                                    className="w-full mt-1 border rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                    Category
                                </label>
                                <select
                                    id="category"
                                    className="w-full mt-1 border rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select category</option>
                                    <option value="TV">TV/Monitors</option>
                                    <option value="PC">PC</option>
                                    <option value="GA">Gaming/Console</option>
                                    <option value="PH">Phones</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Product Description
                            </label>
                            <textarea
                                id="description"
                                rows="4"
                                placeholder="Write product description here"
                                className="w-full mt-1 border rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>


                        <div className="flex justify-end space-x-4">
                            <Button
                                variant="outline"
                                size="default"
                                type="button"
                                onClick={onClose}>
                                Cancelar
                            </Button>
                            <Button variant="default" size="default">
                                Guardar
                            </Button>
                        </div>
                    </form> */}
                </div>
            </div>
        </>
    )
}

export default ModalFormCliente
