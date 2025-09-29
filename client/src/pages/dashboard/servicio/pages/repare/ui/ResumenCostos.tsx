import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calculator } from 'lucide-react';

interface ResumenCostosProps {
    manoObra: number;
    totalRepuestos: number;
    precioTotal: number;
}

const ResumenCostos = ({ manoObra, totalRepuestos, precioTotal }: ResumenCostosProps) => {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                    <Calculator className="w-4 h-4 mr-2" />
                    Resumen de Costos
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span>Mano de Obra:</span>
                    <span>${manoObra.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span>Repuestos:</span>
                    <span>${totalRepuestos.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base border-t pt-2">
                    <span>Total:</span>
                    <span className="text-green-600">${precioTotal.toFixed(2)}</span>
                </div>
            </CardContent>
        </Card>
    );
};

export default ResumenCostos;