import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Search, X, Plus, Package, Loader2 } from 'lucide-react';
import { useFiltreProductHook } from '@/hooks/useService';

interface Producto {
    id: number;
    nombre: string;
    stock: number;
    precio_venta: number;
}

interface BuscarRepuestosProps {
    agregarRepuesto: (producto: Producto) => void;
}

const BuscarRepuestos = ({ agregarRepuesto }: BuscarRepuestosProps) => {
    const [busquedaProducto, setBusquedaProducto] = useState('');
    const [sheetOpen, setSheetOpen] = useState(false);

    const { data: productos, isLoading } = useFiltreProductHook(busquedaProducto);

    const productosFiltrados = useMemo(() => {
        if (!productos) return [];

        // Asegurarnos de que trabajamos con un array
        const productosArray = Array.isArray(productos) ? productos : productos.data || [];

        if (!busquedaProducto.trim()) return productosArray;

        return productosArray.filter((p: Producto) =>
            p.nombre.toLowerCase().includes(busquedaProducto.toLowerCase())
        );
    }, [busquedaProducto, productos]);

    const handleAgregarProducto = (producto: Producto) => {
        agregarRepuesto(producto);
        setSheetOpen(false); // Cerrar el sheet después de agregar
        setBusquedaProducto(''); // Limpiar búsqueda
    };

    return (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
                <Button size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Agregar
                </Button>
            </SheetTrigger>

            <SheetContent className="w-full sm:max-w-md p-4">
                <SheetHeader className="pb-4">
                    <SheetTitle className="text-lg">Buscar Repuestos</SheetTitle>
                </SheetHeader>

                {/* Buscador */}
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre..."
                        value={busquedaProducto}
                        onChange={(e) => setBusquedaProducto(e.target.value)}
                        className="pl-10 pr-10 h-10"
                    />
                    {busquedaProducto && (
                        <X
                            className="absolute right-3 top-3 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground"
                            onClick={() => setBusquedaProducto('')}
                        />
                    )}
                </div>

                {/* Lista productos */}
                <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin mr-2" />
                            <p className="text-sm text-muted-foreground">Cargando productos...</p>
                        </div>
                    ) : productosFiltrados.length > 0 ? (
                        productosFiltrados.map((producto: Producto) => (
                            <div
                                key={producto.id}
                                onClick={() => handleAgregarProducto(producto)}
                                className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm mb-1 truncate">{producto.nombre}</p>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span className="text-green-600 font-semibold">
                                                ${producto.precio_venta}
                                            </span>
                                            <span className={producto.stock < 3 ? 'text-red-500' : 'text-gray-600'}>
                                                Stock: {producto.stock}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 p-2 rounded ml-2 flex-shrink-0">
                                        <Package className="w-4 h-4 text-blue-600" />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <p className="text-sm">
                                {busquedaProducto ? 'No se encontraron productos' : 'Ingresa un término de búsqueda'}
                            </p>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default BuscarRepuestos;