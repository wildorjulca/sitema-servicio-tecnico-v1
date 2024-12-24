import { Button } from "@/components/ui/button"
import { useStoreMCS } from "@/store"


import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import ShowServicioClient from "./ui/ShowServicioClient"
import { BellRing, Check, ChevronRight } from "lucide-react"


const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
})
const ServicioNuevo = () => {
    const { isModalOpen, openModal, closeModal } = useStoreMCS();
    console.log({ isModalOpen });

    // Define the form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
        },
    });

    // Form submission handler
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
    }

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
            <div className="fixed bottom-0 z-50 w-full -translate-x-1/2 bg-white border-t border-gray-200 left-1/2 dark:bg-gray-700 dark:border-gray-600">
                {/* Group Buttons */}
                <div className="w-full">
                    <div
                        className="grid max-w-xs grid-cols-3 gap-1 p-1 mx-auto my-2 bg-gray-100 rounded-lg dark:bg-gray-600"
                        role="group"
                    >
                        <button
                            type="button"
                            className="px-5 py-1.5 text-xs font-medium text-gray-900 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700 rounded-lg"
                            title="New"
                        >
                            New
                        </button>
                        <button
                            type="button"
                            className="px-5 py-1.5 text-xs font-medium text-white bg-gray-900 dark:bg-gray-300 dark:text-gray-900 rounded-lg"
                            title="Popular"
                        >
                            Popular
                        </button>
                        <button
                            type="button"
                            className="px-5 py-1.5 text-xs font-medium text-gray-900 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700 rounded-lg"
                            title="Following"
                        >
                            Following
                        </button>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
                    {[
                        { title: "Home", icon: "M19.707 9.293l-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414z" },
                        { title: "Bookmark", icon: "M13 20a1 1 0 0 1-.64-.231L7 15.3l-5.36 4.469A1 1 0 0 1 0 19V2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v17a1 1 0 0 1-1 1Z" },
                        { title: "New Post", icon: "M9 1v16M1 9h16", customViewBox: "0 0 18 18" },
                        { title: "Search", icon: "M19 19l-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" },
                        { title: "Settings", icon: "M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2" },
                    ].map(({ title, icon, customViewBox = "0 0 20 20" }) => (
                        <button
                            key={title}
                            type="button"
                            className="inline-flex flex-col items-center justify-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 group"
                        >
                            <svg
                                className="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox={customViewBox}
                            >
                                <path d={icon} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            </svg>
                            <span
                                className="absolute px-2 py-1 text-xs font-medium text-white bg-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ top: "-20px", whiteSpace: "nowrap" }}
                            >
                                {title}
                            </span>
                            <span className="sr-only">{title}</span>
                        </button>
                    ))}
                </div>
            </div>




            <section className="w-full flex flex-col lg:flex-row gap-4 mt-6">
                {/* Formulario - 20% del ancho */}
                <div className="w-full lg:w-[60%]">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="shadcn" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This is your public display name.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="shadcn" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This is your public display name.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="shadcn" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This is your public display name.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="shadcn" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This is your public display name.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="shadcn" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This is your public display name.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="shadcn" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This is your public display name.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
                </div>

                {/* Estadísticas - 20% del ancho */}
                <div className="w-full lg:w-[40%]">
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
                                {/* <Switch /> */}
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
                    {/* <div className="border  mx-auto w-full">
                    <h4 className="px-4 py-3  font-medium text-gray-700 uppercase">Detalle del servicio</h4>
                        <div className="grid grid-cols-1 gap-12">
                            <div className="card">
                                <div className="px-4 py-3 border-0 card-header">
                                    <span className="text-white badge bg-blue-700 rounded-full px-3 py-1">32 Total</span>
                                </div>
                                <div className="px-4 mb-1 -mt-2 divide-y divide-gray-200 card-body">
                                    <div className="flex items-center justify-between py-3 text-sm">
                                        <div className="flex items-center space-x-2 text-gray-700">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="flex-none w-5 h-5">
                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                <path
                                                    fillRule="evenodd"
                                                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <span>Unique Views</span>
                                        </div>
                                        <span className="font-mono text-gray-900">132</span>
                                    </div>
                                    <div className="flex items-center justify-between py-3 text-sm">
                                        <div className="flex items-center space-x-2 text-gray-700">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="flex-none w-5 h-5">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <span>Comments</span>
                                        </div>
                                        <span className="font-mono text-gray-900">32,422</span>
                                    </div>
                                </div>
                                <a href="#" className="px-4 py-3 text-sm font-medium text-purple-700 hover:text-purple-900 card-footer">
                                    More Information
                                </a>
                            </div>
                        </div>
                    </div> */}
                </div>
            </section>

            {/* Modal controlado por Zustand */}
            {isModalOpen && <ShowServicioClient />}
        </>
    );
};

export default ServicioNuevo;
