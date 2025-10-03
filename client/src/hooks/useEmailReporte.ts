// hooks/useEmailReporte.ts
import { enviarReportePorEmail } from '@/apis/emailService';
import { useState } from 'react';

interface UseEmailReporteProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const useEmailReporte = ({ onSuccess, onError }: UseEmailReporteProps = {}) => {
  const [isSending, setIsSending] = useState(false);

  const enviarReporte = async (
    emailDestino: string,
    tipoPeriodo: string,
    fechaBase: string,
    pdfBlob: Blob,
    asunto?: string,
    mensaje?: string
  ) => {
    setIsSending(true);
    
    try {
      const result = await enviarReportePorEmail({
        emailDestino,
        tipoPeriodo,
        fechaBase,
        asunto,
        mensaje,
        pdfBlob
      });

      onSuccess?.();
      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      onError?.(errorMessage);
      throw error;
    } finally {
      setIsSending(false);
    }
  };

  return {
    enviarReporte,
    isSending
  };
};