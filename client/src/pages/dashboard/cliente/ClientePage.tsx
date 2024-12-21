import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import ModalFormCliente from './ui/ModalFormCliente';
import TableCliente from './ui/TableCliente';

export const ClientePage = () => {
    return (
        <>
            <div className="p-6  rounded-lg shadow">
                <h1 className="text-2xl font-semibold mb-4">Todas las cuentas</h1>
                {/* Contenedor responsivo */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0 mb-4">
                    {/* Input responsivo */}
                    <div className="flex items-center w-full md:w-auto space-x-2">
                        <Input
                            type="text"
                            placeholder="Buscar usuarios"
                            className=""
                        />
                    </div>
                    {/* Botones responsivos */}
                    <div className="flex justify-between md:justify-end space-x-4">
                        {/* MModal del formulario */}
                        <ModalFormCliente />
                        <Button variant="outline" size="default">
                            Exportar a CSV
                        </Button>
                    </div>
                </div>
                {/* Tabla o contenido adicional */}
                <TableCliente />
            </div>
        </>
    );
};

export default ClientePage;
