import { imagesService } from '@/apis/imageProduct';
import { useState, useCallback } from 'react';

export const useImages = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = useCallback(async (productoId: number, file: File) => {
    try {
      setLoading(true);
      setError(null);
      const result = await imagesService.uploadImage(productoId, file);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.mensaje || 'Error al subir imagen';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadMultipleImages = useCallback(async (productoId: number, files: File[]) => {
    try {
      setLoading(true);
      setError(null);
      const result = await imagesService.uploadMultipleImages(productoId, files);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.mensaje || 'Error al subir imágenes';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getProductImages = useCallback(async (productoId: number) => {
    try {
      setLoading(true);
      setError(null);
      const result = await imagesService.getProductImages(productoId);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.mensaje || 'Error al obtener imágenes';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteImage = useCallback(async (imageId: number) => {
    try {
      setLoading(true);
      setError(null);
      const result = await imagesService.deleteImage(imageId);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.mensaje || 'Error al eliminar imagen';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    uploadImage,
    uploadMultipleImages,
    getProductImages,
    deleteImage,
    clearError: () => setError(null)
  };
};