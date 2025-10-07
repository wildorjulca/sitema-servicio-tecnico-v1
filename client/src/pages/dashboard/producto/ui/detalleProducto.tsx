// components/DetalleProducto.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { useProductoById } from "@/hooks/useProductoHook";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2, Plus, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteProducto } from "@/hooks/useProductoHook";
import toast from "react-hot-toast";
import { IconCloud } from "@tabler/icons-react"
import React, { useRef, useState } from "react";



import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { useImages } from "@/hooks/useImageProducto";

export function DetalleProducto() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const usuarioId = user?.id;
  
  const productoId = id ? parseInt(id) : 0;
  
  // Estados para imágenes
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  
  // Referencias
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: producto, isLoading, isError, refetch } = useProductoById(usuarioId, id);
  const deleteProduct = useDeleteProducto(usuarioId!);

  // Hook para manejar imágenes
  const { 
    getProductImages, 
    deleteImage, 
    uploadMultipleImages 
  } = useImages();

  // Estado para las imágenes del producto
  const [productImages, setProductImages] = useState<any[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);

  // Cargar imágenes al montar el componente
  const loadProductImages = async () => {
    if (!productoId) return;
    
    try {
      setLoadingImages(true);
      const result = await getProductImages(productoId);
      if (result.success && result.data) {
        setProductImages(result.data);
      }
    } catch (error) {
      console.error('Error cargando imágenes:', error);
    } finally {
      setLoadingImages(false);
    }
  };

  // Efecto para cargar imágenes cuando cambie el productoId
  React.useEffect(() => {
    if (productoId) {
      loadProductImages();
    }
  }, [productoId]);

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

  const handleAddImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Validaciones
    const invalidFiles = files.filter(file => 
      !file.type.startsWith('image/') || file.size > 5 * 1024 * 1024
    );

    if (invalidFiles.length > 0) {
      toast.error("Algunos archivos no son válidos (solo imágenes hasta 5MB)");
      return;
    }

    try {
      setUploading(true);
      const result = await uploadMultipleImages(productoId, files);
      
      if (result.success) {
        toast.success(`¡${result.data?.length || files.length} imagen(es) subida(s) correctamente!`);
        
        // Recargar la lista de imágenes
        await loadProductImages();
        
        // Limpiar input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        toast.error(result.mensaje || "Error al subir imágenes");
      }
    } catch (error: any) {
      toast.error(error.message || "Error al subir imágenes");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm('¿Estás seguro de eliminar esta imagen?')) return;

    try {
      const result = await deleteImage(imageId);
      if (result.success) {
        toast.success("Imagen eliminada correctamente");
        // Actualizar lista local
        setProductImages(prev => prev.filter(img => img.id !== imageId));
      } else {
        toast.error(result.mensaje || "Error al eliminar imagen");
      }
    } catch (error: any) {
      toast.error(error.message || "Error al eliminar imagen");
    }
  };

  const handleSetMainImage = async (imageUrl: string) => {
    // Aquí puedes implementar la lógica para establecer como imagen principal
    // Esto dependerá de cómo manejes la imagen principal en tu producto
    console.log('Establecer como imagen principal:', imageUrl);
    toast.success("Imagen principal actualizada");
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna 1: Imagen principal y galería */}
        <div className="lg:col-span-1 space-y-6">
          {/* Imagen principal */}
          <div className="rounded-lg border p-4 flex items-center justify-center h-80 bg-gray-50">
            {producto.imagen_url ? (
              <div className="relative group w-full h-full">
                <img
                  src={producto.imagen_url}
                  alt={producto.nombre}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : productImages.length > 0 ? (
              <img
                src={productImages[0].url}
                alt={producto.nombre}
                className="w-full h-full object-contain"
              />
            ) : (
              <Empty className="border border-dashed">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <IconCloud />
                  </EmptyMedia>
                  <EmptyTitle>Sin imagen</EmptyTitle>
                  <EmptyDescription>
                    Agrega imágenes para este producto.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button variant="outline" size="sm" onClick={handleAddImage}>
                    Subir imagen
                  </Button>
                </EmptyContent>
              </Empty>
            )}
          </div>

          {/* Galería de imágenes */}
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Galería de Imágenes</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleAddImage}
                disabled={uploading}
              >
                <Plus className="h-4 w-4 mr-1" />
                {uploading ? "Subiendo..." : "Agregar"}
              </Button>
            </div>

            {loadingImages ? (
              <div className="grid grid-cols-3 gap-2">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : productImages.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {productImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt={`Imagen ${image.id}`}
                      className="w-full h-20 object-cover rounded border cursor-pointer"
                      onClick={() => setSelectedImage(image)}
                    />
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleSetMainImage(image.url)}
                      className="absolute -top-2 -left-2 bg-blue-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2"
                    >
                      Principal
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <IconCloud className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No hay imágenes</p>
              </div>
            )}
          </div>
        </div>

        {/* Columna 2: Información del producto */}
        <div className="lg:col-span-2 space-y-6">
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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <Button onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" /> Editar Producto
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" /> Eliminar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Input file oculto */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        className="hidden"
      />

      {/* Modal para vista ampliada */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="bg-white rounded-lg max-w-4xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Vista Previa</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <img
                src={selectedImage.url}
                alt="Vista ampliada"
                className="max-w-full max-h-96 object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}