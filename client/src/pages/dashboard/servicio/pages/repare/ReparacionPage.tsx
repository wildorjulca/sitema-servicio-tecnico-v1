// ReparacionPage.tsx - Versión corregida
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Repare from './ui/repare';

const ReparacionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();


  // Validar que el ID existe
  if (!id) {
    return (
      <div className="container mx-auto p-6">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">Error: No se proporcionó ID de servicio</p>
        </div>
      </div>
    );
  }

  const servicioId = parseInt(id);
  
  if (isNaN(servicioId)) {
    return (
      <div className="container mx-auto p-6">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">Error: ID de servicio no válido</p>
        </div>
      </div>
    );
  }

  // ✅ DATOS CORREGIDOS - SIN usuario_soluciona_id automático
  const servicioData = {
    servicio_id: servicioId,
    idServicio: servicioId,
    diagnostico: '',
    solucion: '',
    precio_mano_obra: 0,
    estado_id: 2, // Ya está en estado 2 desde que se hizo clic en "Reparar"
    repuestos: []
  };

  return <Repare servicioData={servicioData} />;
};

export default ReparacionPage;