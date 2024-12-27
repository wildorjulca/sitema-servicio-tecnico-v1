import { Button } from "@/components/ui/button"
import { useStoreMCS } from "@/store"



import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import ShowServicioClient from "./ui/ShowServicioClient"
import { BellRing, Check, ChevronRight } from "lucide-react"
import FormServicio from "./ui/Form-servicio"
import NavServicio from "./ui/nav-servicio"

const ServicioNuevo = () => {
    const { isModalOpen, openModal, closeModal } = useStoreMCS();
    console.log({ isModalOpen });

    const notifications = [
        {
            title: "Your call has been confirmed.",
            description: "1 hour ago",
        },
        {
            title: "You have a new message!",
            description: "1 hour ago",
        },
        {
            title: "Your subscription is expiring soon!",
            description: "2 hours ago",
        },
    ]
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



            <section className="w-full flex flex-col lg:flex-row gap-4 mt-6">

                {/* Formulario - 20% del ancho */}
                <div className="w-full lg:w-[60%]">
                    <FormServicio />
                </div>


                {/* Estadísticas - 20% del ancho */}
                <div className="relative w-full lg:w-[40%]">
                    <NavServicio />

                    <Card>
                        <CardHeader>
                            <CardTitle>Notifications</CardTitle>
                            <CardDescription>You have 3 unread messages.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className=" flex items-center space-x-4 rounded-md border p-4">
                                <BellRing />
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        Push Notifications
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Send notifications to device.
                                    </p>
                                </div>
                            </div>
                            <div>
                                {notifications.map((notification, index) => (
                                    <div
                                        key={index}
                                        className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                                    >
                                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {notification.title}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {notification.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">
                                <Check /> Mark all as read
                            </Button>
                        </CardFooter>
                    </Card>

                </div>
            </section>

            {/* Modal controlado por Zustand */}
            {isModalOpen && <ShowServicioClient />}
        </>
    );
};

export default ServicioNuevo;
