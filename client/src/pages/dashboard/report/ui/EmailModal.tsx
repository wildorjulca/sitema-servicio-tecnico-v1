// components/EmailModal.tsx
import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Mail, Send } from 'lucide-react';
import { useEmailReporte } from '@/hooks/useEmailReporte';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  tipoPeriodo: string;
  fechaBase: string;
  pdfBlob: Blob | null;
}

export const EmailModal = ({ 
  isOpen, 
  onClose, 
  tipoPeriodo, 
  fechaBase, 
  pdfBlob 
}: EmailModalProps) => {
  const [emailDestino, setEmailDestino] = useState('');
  const [asunto, setAsunto] = useState(`Reporte de Servicios - ${tipoPeriodo}`);
  const [mensaje, setMensaje] = useState(`Adjunto el reporte de servicios del periodo ${tipoPeriodo} con fecha base ${fechaBase}.`);

  const { enviarReporte, isSending } = useEmailReporte({
    onSuccess: () => {
      onClose();
      // Puedes usar un toast aquí
      alert('✅ Reporte enviado exitosamente!');
    },
    onError: (error) => {
      alert(`❌ Error al enviar: ${error}`);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailDestino) {
      alert('⚠️ Por favor ingresa un email destino');
      return;
    }

    if (!pdfBlob) {
      alert('❌ No hay PDF para enviar');
      return;
    }

    await enviarReporte(emailDestino, tipoPeriodo, fechaBase, pdfBlob, asunto, mensaje);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Enviar Reporte por Email
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email Destino *</Label>
            <Input
              id="email"
              type="email"
              placeholder="ejemplo@empresa.com"
              value={emailDestino}
              onChange={(e) => setEmailDestino(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="asunto">Asunto</Label>
            <Input
              id="asunto"
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="mensaje">Mensaje</Label>
            <Textarea
              id="mensaje"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              rows={4}
            />
          </div>

          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSending}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSending || !emailDestino || !pdfBlob}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              {isSending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Enviar Reporte
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};