import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export const ClientePage = () => {
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
                            className="w-full bg-gray-50 
                        placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6
                        md:max-w-md"
                        />
                    </div>

                    {/* Botones responsivos */}
                    <div className="flex justify-between md:justify-end space-x-4">
                        <Button variant="default" size="default" >
                            Agregar usuario
                        </Button>
                        <Button variant="outline" size="default">
                            Exportar a CSV
                        </Button>
                    </div>
                </div>

                {/* Tabla o contenido adicional */}
                {/* <UserTable /> */}
            </div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">Edit Profile</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Nuevo customer</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                defaultValue="Pedro Duarte"
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                                Username
                            </Label>
                            <Input
                                id="username"
                                defaultValue="@peduarte"
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>

    );
}

export default ClientePage
