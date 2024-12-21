import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import clsx from 'clsx';
import ModalFormCliente from './ui/ModalFormCliente';

export const ClientePage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Funciones para manejar el estado del modal
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <div className="p-6 bg-white rounded-lg shadow">
                <h1 className="text-2xl font-semibold mb-4">Todas las cuentas</h1>

                {/* Contenedor responsivo */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0 mb-4">
                    {/* Input responsivo */}
                    <div className="flex items-center w-full md:w-auto space-x-2">
                        <Input
                            type="text"
                            placeholder="Buscar usuarios"
                            className="w-full bg-gray-50 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 md:max-w-md"
                        />
                    </div>

                    {/* Botones responsivos */}
                    <div className="flex justify-between md:justify-end space-x-4">
                        <Button variant="default" size="default" onClick={openModal}>
                            Agregar usuario
                        </Button>
                        <Button variant="outline" size="default">
                            Exportar a CSV
                        </Button>
                    </div>
                </div>

                {/* Tabla o contenido adicional */}
                {/* <UserTable /> */}

                {/* MModal del formulario */}
                <ModalFormCliente isOpen={isModalOpen} onClose={closeModal} />
            </div>
        </>
    );
};

export default ClientePage;
