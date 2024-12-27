import { useForm } from "react-hook-form"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { servicioSchema } from "@/lib/zods"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"

const FormServicio = () => {
    // Define the form
    const form = useForm<z.infer<typeof servicioSchema>>({
        resolver: zodResolver(servicioSchema),
        defaultValues: {
            MOTIVO_INGRESO_idMOTIVO_INGRESO: "",
            descripcion_motivo: "",
            observacion: ""
        },
    });

    // Form submission handler
    function onSubmit(values: z.infer<typeof servicioSchema>) {
        console.log(values);
    }
    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Select con validación */}
                    <FormField

                        control={form.control}
                        name="MOTIVO_INGRESO_idMOTIVO_INGRESO"
                        rules={{ required: "Por favor, selecciona una fruta" }} // Validación requerida
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Selecciona una fruta</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange} // Actualizar el valor con React Hook Form
                                        value={field.value} // Sincronizar con el valor actual del formulario
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a fruit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Fruits</SelectLabel>
                                                <SelectItem value="apple">Apple</SelectItem>
                                                <SelectItem value="banana">Banana</SelectItem>
                                                <SelectItem value="blueberry">Blueberry</SelectItem>
                                                <SelectItem value="grapes">Grapes</SelectItem>
                                                <SelectItem value="pineapple">Pineapple</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormDescription>
                                    Selecciona tu fruta favorita.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Otro campo */}
                    <FormField
                        control={form.control}
                        name="descripcion_motivo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Descripcion del motivo</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="observacion"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Observación a la reparación</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </>
    )
}

export default FormServicio