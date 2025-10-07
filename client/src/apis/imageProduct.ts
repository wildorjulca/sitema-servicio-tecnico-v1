import { instance } from "@/lib/axios";

export const imagesService = {
  // Subir una imagen
  uploadImage: async (productoId: number, file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('productoId', productoId.toString());

    const response = await instance.post<{
      data: { id: number };
      success: boolean;
      mensaje: string;
    }>('/img', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    const { data, success, mensaje } = response.data;
    console.log("Imagen subida:", { data, success, mensaje });
    return { data, success, mensaje };
  },

  // Subir múltiples imágenes
  uploadMultipleImages: async (productoId: number, files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    formData.append('productoId', productoId.toString());

    const response = await instance.post<{
      data: any[];
      success: boolean;
      mensaje: string;
    }>('/upload/multiples', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    const { data, success, mensaje } = response.data;
    console.log("Imágenes múltiples subidas:", { data, success, mensaje });
    return { data, success, mensaje };
  },

  // Obtener imágenes de un producto
  getProductImages: async (productoId: number) => {
    const response = await instance.get<{
      data: any[];
      success: boolean;
      total?: number;
    }>(`/imgGet/${productoId}`);

    const { data, success, total } = response.data;
    console.log("Imágenes obtenidas:", { data, success, total });
    return { data, success, total };
  },

  // Eliminar una imagen
  deleteImage: async (imageId: number) => {
    const response = await instance.delete<{
      success: boolean;
      mensaje: string;
      data?: { affectedRows: number };
    }>(`/deleteImg /${imageId}`);

    const { success, mensaje, data } = response.data;
    console.log("Imagen eliminada:", { success, mensaje, data });
    return { success, mensaje, data };
  },

  // Eliminar todas las imágenes de un producto
  deleteAllProductImages: async (productoId: number) => {
    const response = await instance.delete<{
      success: boolean;
      mensaje: string;
      data?: { affectedRows: number };
    }>(`/images/producto/${productoId}/all`);

    const { success, mensaje, data } = response.data;
    console.log("Todas las imágenes eliminadas:", { success, mensaje, data });
    return { success, mensaje, data };
  },

  // Obtener imagen por ID
  getImageById: async (imageId: number) => {
    const response = await instance.get<{
      data: any;
      success: boolean;
      mensaje?: string;
    }>(`/images/${imageId}`);

    const { data, success, mensaje } = response.data;
    console.log("Imagen obtenida por ID:", { data, success, mensaje });
    return { data, success, mensaje };
  }
};