// components/DetalleProducto.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { useProductoById } from "@/hooks/useProductoHook";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteProducto } from "@/hooks/useProductoHook";
import toast from "react-hot-toast";

export function DetalleProducto() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const usuarioId = user?.id;

  const { data: producto, isLoading, isError, refetch } = useProductoById(usuarioId, id);
  const deleteProduct = useDeleteProducto(usuarioId!);

  const handleDelete = () => {
    if (!producto?.id) return;
    
    deleteProduct.mutate(producto.id, {
      onSuccess: () => {
        toast.success("Producto eliminado");
        navigate("/dashboard/producto");
      },
      onError: () => toast.error("Error al eliminar producto"),
    });
  };

  const handleEdit = () => {
    navigate(`/producto/edit/${id}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6">
          <Skeleton className="h-10 w-10 mr-2" />
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-80 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-8 w-1/3" />
            <div className="flex space-x-4 pt-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !producto) {
    return (
      <div className="container mx-auto p-6">
        <Button variant="outline" onClick={() => navigate("/dashboard/producto")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600">Producto no encontrado</h2>
          <p className="mt-2 text-gray-500">El producto que buscas no existe o no tienes permisos para verlo.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Button variant="outline" onClick={() => navigate("/dashboard/producto")} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver al listado
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imagen del producto */}
        <div className="bg-white rounded-lg border p-4 flex items-center justify-center h-80">
          {producto.imagen_url ? (
            <img 
              src={producto.imagen_url} 
              alt={producto.nombre}
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <div className="text-gray-400 text-center">
              <p>Sin imagen</p>
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{producto.nombre}</h1>
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold text-green-600">${producto.precio_venta}</span>
            {producto.precio_compra && (
              <span className="text-sm text-gray-500 line-through">${producto.precio_compra}</span>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Descripción</h3>
            <p className="text-gray-700">{producto.descripcion || "Sin descripción"}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-500">Stock</h4>
              <p className={producto.stock > 0 ? "text-green-600" : "text-red-600"}>
                {producto.stock} unidades
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-500">Categoría</h4>
              <p>{producto.categoria_id || "Sin categoría"}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-500">Estado</h4>
              <p className={producto.estado ? "text-green-600" : "text-red-600"}>
                {producto.estado ? "Activo" : "Inactivo"}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-500">ID</h4>
              <p className="text-sm font-mono">{producto.id}</p>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex space-x-4 pt-4">
            <Button onClick={handleEdit} disabled>
              <Edit className="mr-2 h-4 w-4 "/> Editar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" /> Eliminar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}