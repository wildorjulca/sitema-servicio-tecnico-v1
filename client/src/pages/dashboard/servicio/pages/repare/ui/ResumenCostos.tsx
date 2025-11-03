import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calculator,Edit,Save, X } from 'lucide-react';
import { useState } from 'react';

interface ResumenCostosProps {
    manoObra: number;
    totalRepuestos: number;
    descuentoRepuestos: number;
    precioTotal: number;
    onAplicarDescuento?: (descuento: number) => void;
    servicioId?: number;
}

const ResumenCostos = ({ 
    manoObra, 
    totalRepuestos, 
    descuentoRepuestos,
    precioTotal, 
    onAplicarDescuento,
    servicioId 
}: ResumenCostosProps) => {
    const [editandoDescuento, setEditandoDescuento] = useState(false);
    const [nuevoDescuento, setNuevoDescuento] = useState(descuentoRepuestos.toString());
    const [aplicando, setAplicando] = useState(false);

    const handleAplicarDescuento = async () => {
        if (!onAplicarDescuento) return;
        
        const valorDescuento = parseFloat(nuevoDescuento);
        if (isNaN(valorDescuento) || valorDescuento < 0 || valorDescuento > totalRepuestos) {
            alert('El descuento debe ser entre 0 y ' + totalRepuestos);
            return;
        }

        setAplicando(true);
        try {
            await onAplicarDescuento(valorDescuento);
            setEditandoDescuento(false);
        } catch (error) {
            console.error('Error al aplicar descuento:', error);
        } finally {
            setAplicando(false);
        }
    };

    const handleCancelar = () => {
        setNuevoDescuento(descuentoRepuestos.toString());
        setEditandoDescuento(false);
    };

    const repuestosConDescuento = totalRepuestos - descuentoRepuestos;

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
                
                <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                        <span>Repuestos:</span>
                        <span>${totalRepuestos.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm items-center">
                        <span className="text-red-600">Descuento:</span>
                        {editandoDescuento ? (
                            <div className="flex items-center space-x-2">
                                <input
                                    type="number"
                                    step="0"
                                    min="0"
                                    max={totalRepuestos}
                                    value={nuevoDescuento}
                                    onChange={(e) => setNuevoDescuento(e.target.value)}
                                    className="w-20 px-2 py-1 text-sm border rounded"
                                    disabled={aplicando}
                                />
                                <button
                                    onClick={handleAplicarDescuento}
                                    disabled={aplicando}
                                    className="text-green-600 hover:text-green-800"
                                >
                                    <Save className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={handleCancelar}
                                    disabled={aplicando}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <span className="text-red-600">-${descuentoRepuestos.toFixed(2)}</span>
                                {onAplicarDescuento && (
                                    <button
                                        onClick={() => setEditandoDescuento(true)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                    
                    {descuentoRepuestos > 0 && (
                        <div className="flex justify-between text-sm font-medium border-t pt-1">
                            <span>Repuestos con descuento:</span>
                            <span>${repuestosConDescuento.toFixed(2)}</span>
                        </div>
                    )}
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