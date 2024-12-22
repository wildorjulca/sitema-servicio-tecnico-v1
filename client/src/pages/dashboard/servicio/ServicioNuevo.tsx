import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


import {
    Calculator,
    Calendar,
    CreditCard,
    Settings,
    Smile,
    User,
} from "lucide-react"

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"

const ServicioNuevo = () => {
    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">Edit Profile</Button>
                </DialogTrigger>

                <DialogContent className="">  {/* className="sm:max-w-[425px]" */}
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <Command className="rounded-lg border shadow-md md:min-w-[450px]">
                        <CommandInput placeholder="Buscar cliente con servicio.." />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup heading="Suggestions">
                                <CommandItem>
                                    <Calendar />
                                    <span>Calendar</span>
                                </CommandItem>
                                <CommandItem>
                                    <Smile />
                                    <span>Search Emoji</span>
                                </CommandItem>
                                <CommandItem disabled>
                                    <Calculator />
                                    <span>Calculator</span>
                                </CommandItem>
                            </CommandGroup>
                            <CommandSeparator />
                            <CommandGroup heading="Settings">
                                <CommandItem>
                                    <User />
                                    <span>Profile</span>
                                    <CommandShortcut>⌘P</CommandShortcut>
                                </CommandItem>
                                <CommandItem>
                                    <CreditCard />
                                    <span>Billing</span>
                                    <CommandShortcut>⌘B</CommandShortcut>
                                </CommandItem>
                                <CommandItem>
                                    <Settings />
                                    <span>Settings</span>
                                    <CommandShortcut>⌘S</CommandShortcut>
                                </CommandItem>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                    <DialogFooter>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>



            {/* <section className="px-4 py-12 mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                    <div className="card">
                        <div className="px-4 py-3 border-0 card-header">
                            <h4 className="font-medium text-gray-800">Posts Stats</h4>
                            <span className="text-white badge bg-blue-700 rounded-full px-3 py-1">32 Total</span>
                        </div>
                        <div className="px-4 mb-1 -mt-2 divide-y divide-gray-200 card-body">
                            <div className="flex items-center justify-between py-3 text-sm">
                                <div className="flex items-center space-x-2 text-gray-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="flex-none w-5 h-5">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path
                                            fill-rule="evenodd"
                                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                            clip-rule="evenodd"
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
                                            fill-rule="evenodd"
                                            d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                                            clip-rule="evenodd"
                                        />
                                    </svg>
                                    <span>Comments</span>
                                </div>
                                <span className="font-mono text-gray-900">32,422</span>
                            </div>
                            <div className="flex items-center justify-between py-3 text-sm">
                                <div className="flex items-center space-x-2 text-gray-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="flex-none w-5 h-5">
                                        <path
                                            fill-rule="evenodd"
                                            d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                                            clip-rule="evenodd"
                                        />
                                    </svg>
                                    <span>Activities</span>
                                </div>
                                <span className="font-mono text-gray-900">0</span>
                            </div>
                            <div className="flex items-center justify-between py-3 text-sm">
                                <div className="flex items-center space-x-2 text-gray-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="flex-none w-5 h-5">
                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                    </svg>
                                    <span>Completed</span>
                                </div>
                                <span className="font-mono text-green-800 bg-green-200 badge">12</span>
                            </div>
                            <div className="flex items-center justify-between py-3 text-sm">
                                <div className="flex items-center space-x-2 text-gray-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="flex-none w-5 h-5">
                                        <path fill-rule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clip-rule="evenodd" />
                                    </svg>
                                    <span>Closed</span>
                                </div>
                                <span className="font-mono text-red-700 bg-red-200 badge">32</span>
                            </div>
                        </div>
                        <a href="#" className="px-4 py-3 text-sm font-medium text-purple-700 hover:text-purple-900 card-footer">More Information</a>
                    </div>
                </div>
            </section> */}


        </>
    )
}

export default ServicioNuevo
