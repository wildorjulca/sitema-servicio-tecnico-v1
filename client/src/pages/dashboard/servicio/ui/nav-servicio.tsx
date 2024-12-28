import { Button } from '@/components/ui/button';
import { useStoreMCS } from '@/store';
import { ChevronRight } from 'lucide-react';

const NavServicio = () => {
    const { isModalOpen, openModal, closeModal } = useStoreMCS();
    return (
        <>
            {/* Botón para abrir el modal */}
            <Button variant="outline" onClick={openModal}>
                Nuevo
            </Button>
            <Button variant="outline" size="icon">
                <ChevronRight />
            </Button>
            <Button variant="outline" size="icon">
                <ChevronRight />
            </Button>
        </>

    );
};

export default NavServicio;
