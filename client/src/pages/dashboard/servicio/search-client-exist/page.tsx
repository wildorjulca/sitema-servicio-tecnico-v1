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
import { fetchCliente } from "@/services/clienteService"
import { useEffect, useState } from "react"

const SearchClientService = () => {
    const [dataCliente, setdataCliente] = useState<ClientTypes[]>([])

    useEffect(() => {
        const getCliente = async () => {
            const { data, status, succes, error } = await fetchCliente()
            if (status) {
                setdataCliente(data)
                return
            }
            if (data.length === 0) {
                setdataCliente([])
                return

            }
        }
        getCliente()
    }, [])
    console.log(dataCliente)

    return (
        <>
            <div>
                <h3>Buscar cliente con servicio</h3>
                <div className="font-[sans-serif]  flex justify-end gap-4 mb-6">
                    {/* Download Button */}
                    <button
                        type="button"
                        className="px-5 py-2.5 flex items-center justify-center rounded text-white text-sm tracking-wider font-medium border-none outline-none bg-blue-600 hover:bg-blue-700 active:bg-blue-600"
                    >
                        Download
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16px"
                            fill="currentColor"
                            className="ml-2 inline"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M12 16a.749.749 0 0 1-.542-.232l-5.25-5.5A.75.75 0 0 1 6.75 9H9.5V3.25c0-.689.561-1.25 1.25-1.25h2.5c.689 0 1.25.561 1.25 1.25V9h2.75a.75.75 0 0 1 .542 1.268l-5.25 5.5A.749.749 0 0 1 12 16zm10.25 6H1.75C.785 22 0 21.215 0 20.25v-.5C0 18.785.785 18 1.75 18h20.5c.965 0 1.75.785 1.75 1.75v.5c0 .965-.785 1.75-1.75 1.75z"
                            />
                        </svg>
                    </button>

                    {/* Buy Button */}
                    <button
                        type="button"
                        className="px-5 py-2.5 flex items-center justify-center rounded text-white text-sm tracking-wider font-medium border-none outline-none bg-purple-600 hover:bg-purple-700 active:bg-purple-600"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16px"
                            fill="currentColor"
                            className="mr-2 inline"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M1 1a1 1 0 1 0 0 2h1.78a.694.694 35.784 0 1 .657.474l3.297 9.893c.147.44.165.912.053 1.362l-.271 1.087C6.117 17.41 7.358 19 9 19h12a1 1 0 1 0 0-2H9c-.39 0-.64-.32-.545-.697l.205-.818A.64.64 142.028 0 1 9.28 15H20a1 1 0 0 0 .95-.684l2.665-8A1 1 0 0 0 22.666 5H6.555a.694.694 35.783 0 1-.658-.474l-.948-2.842A1 1 0 0 0 4 1zm7 19a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"
                            />
                        </svg>
                        Buy
                    </button>

                    {/* Red Button */}
                    <button
                        type="button"
                        className="px-5 py-2.5 flex items-center justify-center rounded text-white text-sm tracking-wider font-medium border-none outline-none bg-red-600 hover:bg-red-700 active:bg-red-600"
                    >
                        <span className="border-r border-white pr-3">Red</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="11px"
                            fill="currentColor"
                            className="ml-3 inline"
                            viewBox="0 0 320.591 320.591"
                        >
                            <path
                                d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                            />
                            <path
                                d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                            />
                        </svg>
                    </button>

                    {/* Message Button */}
                    <button
                        type="button"
                        className="rounded w-max h-10 text-[#333] text-sm tracking-wider font-medium outline-none border border-[#333]"
                    >
                        <div className="flex items-center h-full">
                            <span className="flex-1 px-4">Message</span>
                            <div className="h-full bg-black w-12 flex justify-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16px"
                                    fill="#fff"
                                    viewBox="0 0 512 512"
                                >
                                    <path d="m331.756 277.251-42.881 43.026c-17.389 17.45-47.985 17.826-65.75 0l-42.883-43.026L26.226 431.767C31.959 434.418 38.28 436 45 436h422c6.72 0 13.039-1.58 18.77-4.232L331.756 277.251z" />
                                    <path d="M467 76H45c-6.72 0-13.041 1.582-18.772 4.233l164.577 165.123c.011.011.024.013.035.024a.05.05 0 0 1 .013.026l53.513 53.69c5.684 5.684 17.586 5.684 23.27 0l53.502-53.681s.013-.024.024-.035c0 0 .024-.013.035-.024L485.77 80.232C480.039 77.58 473.72 76 467 76zM4.786 101.212C1.82 107.21 0 113.868 0 121v270c0 7.132 1.818 13.79 4.785 19.788l154.283-154.783L4.786 101.212zm502.428-.002L352.933 256.005 507.214 410.79C510.18 404.792 512 398.134 512 391V121c0-7.134-1.82-13.792-4.786-19.79z" />
                                </svg>
                            </div>
                        </div>
                    </button>
                </div>
                <div className="">
                    <Command className="rounded-lg border shadow-md md:min-w-[450px]">
                        <CommandInput
                            placeholder="Buscar cliente Nombre | DNI"
                        // value={search}
                        // onChange={(e) => setSearch(e.target.value)} // Actualiza el valor de búsqueda
                        />
                        <CommandList>
                            {/* Si no hay resultados, mostramos un mensaje vacío */}
                            {dataCliente.length === 0 ? (
                                <CommandEmpty>No results found.</CommandEmpty>
                            ) : (
                                <>
                                    <CommandGroup heading="Clientes">
                                        {/* Mapear y mostrar los clientes filtrados */}
                                        {dataCliente.map((item, index) => (
                                            <CommandItem key={index}
                                                onSelect={() => console.log({ "cliente seleccionado": item })}
                                            >
                                                <User />
                                                <span>{item.nombre}  ({item.numero_documento})</span>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </>
                            )}
                            <CommandSeparator />
                        </CommandList>
                    </Command>
                </div>


            </div>
        </>
    )
}

export default SearchClientService
