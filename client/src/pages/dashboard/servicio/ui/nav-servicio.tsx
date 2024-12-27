import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { FaHome, FaWallet, FaCog, FaUser } from 'react-icons/fa';

const NavServicio = () => {
    return (
        <div className='flex gap-3'>
            <Button variant={'outline'} className='flex flex-col h-auto'>
                <Mail /> New usario
            </Button>
            <Button variant={'outline'} className='flex flex-col h-auto'>
                <Mail /> New usario
            </Button>
            <Button variant={'outline'} className='flex flex-col h-auto'>
                <Mail /> New usario
            </Button>

        </div>

    );
};

export default NavServicio;
