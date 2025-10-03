// utils/emailService.ts

import { instance } from "@/lib/axios";

interface EmailData {
  emailDestino: string;
  tipoPeriodo: string;
  fechaBase: string;
  asunto?: string;
  mensaje?: string;
  pdfBlob: Blob;
}

export const enviarReportePorEmail = async (datos: EmailData): Promise<{ success: boolean; message: string }> => {
  try {
    const formData = new FormData();
    formData.append('emailDestino', datos.emailDestino);
    formData.append('tipoPeriodo', datos.tipoPeriodo);
    formData.append('fechaBase', datos.fechaBase);
    formData.append('asunto', datos.asunto || `Reporte de Servicios - ${datos.tipoPeriodo}`);
    formData.append('mensaje', datos.mensaje || 'Reporte generado automáticamente desde el sistema.');
    
    const pdfFile = new File([datos.pdfBlob], 
      `Reporte_Servicios_${datos.tipoPeriodo}_${new Date().toISOString().split('T')[0]}.pdf`, 
      { type: 'application/pdf' }
    );
    formData.append('pdf', pdfFile);

    // 🔥 CORREGIDO: Usar la instancia de axios con la baseURL correcta
    const response = await instance.post('/enviar-reporte', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;

  } catch (error: any) {
    console.error('Error enviando reporte por email:', error);
    
    // Manejar error de axios
    const errorMessage = error.response?.data?.error || error.message || 'No se pudo enviar el reporte por email';
    throw new Error(errorMessage);
  }
};

// Verificar configuración del email
export const verificarConfigEmail = async (): Promise<{ hasEmailUser: boolean; hasEmailPass: boolean }> => {
  try {
    // 🔥 CORREGIDO: Usar la instancia de axios
    const response = await instance.get('/config-email');
    return response.data;
  } catch (error) {
    console.error('Error verificando configuración de email:', error);
    return { hasEmailUser: false, hasEmailPass: false };
  }
};