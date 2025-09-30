// components/ImprimirServicio.tsx
import { useParams } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { useServiceyId } from "@/hooks/useService";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Reporte from "./BoletaA4";
import { PDFDownloadLink } from "@react-pdf/renderer";

export function ImprimirServicio() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const usuarioId = user?.id;

  const { data: ServiceData, isLoading } = useServiceyId(usuarioId, id);

  if (isLoading) {
    return <div>Cargando datos del servicio...</div>;
  }

  if (!ServiceData) {
    return <div>Servicio no encontrado</div>;
  }

  // Transformar los datos al formato que espera el Reporte
  const reportData = {
    servicio: {
      ...ServiceData,
      precio: ServiceData.precio || 0,
      precioRepuestos: ServiceData.precioRepuestos || 0,
      precioTotal: ServiceData.precioTotal || 0,
    },
    producto: ServiceData.repuestos || [] // Asegúrate de que este campo exista
  };

  return (
    <div className="container mx-auto p-6">
      <Button 
        variant="outline" 
        onClick={() => navigate(-1)} 
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver
      </Button>

      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Imprimir Comprobante</h1>
        <p className="text-gray-600 mb-6">
          Descarga el comprobante del servicio en formato PDF
        </p>

        <PDFDownloadLink
          document={<Reporte data={reportData} />}
          fileName={`servicio-${ServiceData.codigoSeguimiento}.pdf`}
        >
          {({ loading }) => (
            <Button disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              <Download className="mr-2 h-4 w-4" />
              {loading ? 'Generando PDF...' : 'Descargar PDF'}
            </Button>
          )}
        </PDFDownloadLink>
      </div>
    </div>
  );
}