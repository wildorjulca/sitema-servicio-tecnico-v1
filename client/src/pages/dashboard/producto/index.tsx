// components/Producto.tsx
import { useUser } from "@/hooks/useUser";
import { useState, useEffect } from "react";
import { useProductosHook } from "@/hooks/useProductoHook";
import { Productos } from "@/interface";
import { useAddProducto, useDeleteProducto, useEditProducto } from "@/hooks/useProductoHook";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { ProductDialog } from "./ui/modal";
import { useCatHook } from "@/hooks/useCategoria";
import { DataTableDetalle } from "../ui/table-producto";
import { Navigate } from "react-router-dom";

export function Producto() {
    const { user } = useUser();
    const usuarioId = user?.id;

    // Paginación
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalRows, setTotalRows] = useState(0);

    const { data, total, isLoading, isError, refetch } = useProductosHook(usuarioId, pageIndex, pageSize);
    // Obtener categorías
    const { data: categoriasData, isLoading: loadingCategorias } = useCatHook(
        usuarioId,
        0, // pageIndex
        100 // pageSize - número grande para obtener todas
    );
    console.log("Categorías data:", categoriasData)

    const categoriasArray = Array.isArray(categoriasData)
        ? categoriasData
        : categoriasData?.data || []


    // Mutaciones
    const addProduct = useAddProducto(usuarioId!);
    const editProduct = useEditProducto(usuarioId!);
    const deleteProduct = useDeleteProducto(usuarioId!);

    // Estado para el diálogo y producto actual
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Productos | null>(null);

    useEffect(() => {
        if (usuarioId && data) {
            console.log("Datos de productos:", { data, total });
            setTotalRows(total);
            refetch();
        }
    }, [pageIndex, pageSize, usuarioId, total, refetch]);

    // Abrir modal para agregar
    const openAddModal = () => {
        setCurrentProduct(null);
        setDialogOpen(true);
    };

    // Abrir modal para editar
    const openEditModal = (product: Productos) => {
        setCurrentProduct(product);
        setDialogOpen(true);
    };

    // Eliminar producto
    const handleDelete = (product: Productos) => {
        if (!product.id) {
            toast.error("No se puede eliminar: ID no definido");
            return;
        }

        deleteProduct.mutate(product.id, {
            onSuccess: () => toast.success("Producto eliminado"),
            onError: () => toast.error("Error al eliminar producto"),
        });
    };

    // Manejar envío del formulario
    const handleSubmit = (formData: any) => {
        if (currentProduct) {
            // Editar
            editProduct.mutate({
                ...formData,
                id: currentProduct.id,
                usuarioId
            });
        } else {
            // Agregar
            addProduct.mutate({
                ...formData,
                usuarioId
            });
        }
        setDialogOpen(false);
    };

    if (!usuarioId) return <div>Por favor inicia sesión para ver tus Productos</div>;
    if (isLoading) return <div>Cargando Productos...</div>;
    if (isError) return <div>Error al cargar Productos</div>;

    const mappedProduct = data.map((p: Productos) => ({
        id: p.id,
        nombre: p.nombre,
        descripcion: p.descripcion,
        precio_venta: p.precio_venta,
        precio_compra: p.precio_compra,
        stock: p.stock,
        categoria: p.categoria_id,
        estado: p.estado
    }));

    return (
        <div className="w-full">
            <DataTableDetalle
                data={mappedProduct}
                columns={[
                    { accessorKey: "nombre", header: "Nombre" },
                    { accessorKey: "descripcion", header: "Descripcion" },
                    { accessorKey: "precio_compra", header: "Precio Compra" },
                    { accessorKey: "precio_venta", header: "Precio Venta" },
                    { accessorKey: "stock", header: "Stock" },
                    { accessorKey: "categoria", header: "Cat" },
                    { accessorKey: "estado", header: "Estado" },
                ]}
                searchColumn="nombre"
                pageIndex={pageIndex}
                pageSize={pageSize}
                totalRows={totalRows}
                onPageChange={(newPage) => setPageIndex(newPage)}
                onPageSizeChange={(size) => setPageSize(size)}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onView={(product) => {
                    // Navegar a la página de detalle
                    Navigate(`/productos/detalle/${product.id}`);
                }}
                viewRoute="/productos/detalle"
                actions={<Button onClick={openAddModal}>Agregar Producto</Button>}
            />

            {!loadingCategorias && (
                <ProductDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    product={currentProduct}
                    onSubmit={handleSubmit}
                    categorias={categoriasArray} // ✅ Pasar array asegurado
                />
            )}
        </div>
    );
}