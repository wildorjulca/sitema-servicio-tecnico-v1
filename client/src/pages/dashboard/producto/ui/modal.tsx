// components/ProductDialog.tsx
"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Check, ChevronsUpDown } from "lucide-react"

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
import { Textarea } from "@/components/ui/textarea"
import { Productos } from "@/interface"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Schema Zod para productos
const ProductSchema = z.object({
  nombre: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  descripcion: z.string().optional(),
  precio_compra: z.number().positive({ message: "Precio de compra debe ser mayor a 0" }),
  precio_venta: z.number().positive({ message: "Precio de venta debe ser mayor a 0" }),
  stock: z.number().int().nonnegative({ message: "Stock debe ser >= 0" }),
  categoria_id: z.number().int().positive({ message: "Selecciona una categoría" }),
})

type ProductFormValues = z.infer<typeof ProductSchema>

interface Categoria {
  idCATEGORIA: number;
  descripcion: string;
  esServicio: number;
}

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Productos | null;
  onSubmit: (data: ProductFormValues) => void;
  categorias: Categoria[];
}

export function ProductDialog({
  open,
  onOpenChange,
  product,
  onSubmit,
  categorias
}: ProductDialogProps) {
  const [comboboxOpen, setComboboxOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      precio_compra: 1,
      precio_venta: 1,
      stock: 1,
      categoria_id: 1,
    },
  })

  // Reset form cuando el producto cambia
  React.useEffect(() => {
    if (product && open) {
      form.reset({
        nombre: product.nombre || "",
        descripcion: product.descripcion || "",
        precio_compra: product.precio_compra || 1,
        precio_venta: product.precio_venta || 1,
        stock: product.stock || 1,
        categoria_id: product.categoria_id || 1,
      })
    } else if (open) {
      form.reset({
        nombre: "",
        descripcion: "",
        precio_compra: 1,
        precio_venta: 1,
        stock: 1,
        categoria_id: categorias[0]?.idCATEGORIA || 1,
      })
    }
  }, [product, form, open, categorias])

  const handleFormSubmit = (data: ProductFormValues) => {
    onSubmit(data);
  }

  // Filtrar categorías basado en la búsqueda
  const filteredCategorias = categorias.filter(cat =>
    cat.descripcion.toLowerCase().includes(searchValue.toLowerCase())
  )

  // Obtener el nombre de la categoría seleccionada
  const selectedCategoria = categorias.find(
    cat => cat.idCATEGORIA === form.watch("categoria_id")
  )?.descripcion || "Seleccionar categoría";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {product ? "Editar Producto" : "Nuevo Producto"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            {/* Nombre */}
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Laptop HP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Precio Compra & Precio Venta */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="precio_compra"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio Compra</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0.01"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="precio_venta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio Venta</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0.01"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Stock & Categoria */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoria_id"
                render={({ field }) => (
                  <FormItem className="flex flex-col justify-end">
                    <FormLabel>Categoría</FormLabel>
                    <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {selectedCategoria}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput
                            placeholder="Buscar categoría..."
                            value={searchValue}
                            onValueChange={(value) => {
                              setSearchValue(value);
                              // Forzar re-render
                              setFilteredCategorias(categorias.filter(cat =>
                                cat.descripcion.toLowerCase().includes(value.toLowerCase())
                              ))
                            }}
                          />
                          <CommandList>
                            <CommandEmpty>No se encontraron categorías.</CommandEmpty>
                            <CommandGroup>
                              {filteredCategorias.map((categoria) => (
                                <CommandItem
                                  key={categoria.idCATEGORIA}
                                  value={categoria.descripcion} // Mantener descripción para búsqueda
                                  onSelect={() => {
                                    form.setValue("categoria_id", categoria.idCATEGORIA, { shouldValidate: true })
                                    setSearchValue("")
                                    setComboboxOpen(false)
                                  }}
                                >
                                  {categoria.descripcion}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      categoria.idCATEGORIA === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Descripción */}
            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detalles del producto"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {product ? "Actualizar" : "Guardar"} Producto
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}