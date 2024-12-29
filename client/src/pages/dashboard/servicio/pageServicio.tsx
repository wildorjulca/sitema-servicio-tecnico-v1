import { useStoreMCS } from "@/store";
import { Link, Outlet } from "react-router-dom";
import FormServicio from "./ui/Form-servicio";
import ShowServicioClient from "./ui/ShowServicioClient";
import NavServicio from "./ui/nav-servicio";

const PageServicio = () => {
    const { isModalOpen, openModal, closeModal } = useStoreMCS();
    return (
        <>
            {/* encabezado del servicio */}
            <NavServicio />

            <main className="w-full  flex flex-col lg:flex-row gap-4 mt-6">
                {/* Formulario - 20% del ancho */}
                <div className="w-full lg:w-[60%]">
                    <FormServicio />
                </div>
                {/* Estadísticas - 20% del ancho */}
                <div className="w-full  h-screen sticky top-0 px-2  border-l-2 border-solid border-gray-200
                                lg:w-[40%]">
                    <ul className="flex  overflow-x-auto scrollbar-hidden ">
                        <li className="flex-none">
                            <Link
                                to="/dashboard/servicio/nuevo"
                                className="flex items-center gap-2 border-s-[3px] border-blue-500 bg-blue-50 px-4 py-3 text-blue-700"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="size-5 opacity-75"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                    />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-sm font-medium">General</span>
                            </Link>
                        </li>

                        <li className="flex-none">
                            <Link
                                to="paso2"
                                className="flex items-center gap-2 border-s-[3px] border-transparent px-4 py-3 text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="size-5 opacity-75"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                                <span className="text-sm font-medium">Teams</span>
                            </Link>
                        </li>

                        <li className="flex-none">
                            <Link
                                to="paso3"
                                className="flex items-center gap-2 border-s-[3px] border-transparent px-4 py-3 text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="size-5 opacity-75"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                    />
                                </svg>
                                <span className="text-sm font-medium">Billing</span>
                            </Link>
                        </li>

                        <li className="flex-none">
                            <Link
                                href="#"
                                className="flex items-center gap-2 border-s-[3px] border-transparent px-4 py-3 text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="size-5 opacity-75"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                    />
                                </svg>
                                <span className="text-sm font-medium">Invoices</span>
                            </Link>
                        </li>

                        <li className="flex-none">
                            <Link
                                href="#"
                                className="flex items-center gap-2 border-s-[3px] border-transparent px-4 py-3 text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="size-5 opacity-75"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                                <span className="text-sm font-medium">Account</span>
                            </Link>
                        </li>
                    </ul>
                    <div className='h-full relative top-4 '>
                        {/* <div className="w-full flex flex-col p-4 gap-4 text-lg font-semibold shadow-md border rounded-sm lg:w-full">
                            <div className="w-full flex flex-row justify-between">
                                <p className="text-gray-600">Subtotal (2 Items)</p>
                                <p className="text-end font-bold">$99.98</p>
                            </div>
                            <hr className="bg-gray-200 h-0.5" />
                            <div className="flex flex-row justify-between">
                                <p className="text-gray-600">Freight</p>
                                <div>
                                    <p className="text-end font-bold">$3.90</p>
                                    <p className="text-gray-600 text-sm font-normal">Arrives on Jul 16</p>
                                </div>
                            </div>
                            <hr className="bg-gray-200 h-0.5" />
                            <div className="flex flex-row justify-between">
                                <p className="text-gray-600">Discount Coupon</p>
                                <a className="text-gray-500 text-base underline" href="#">Add</a>
                            </div>
                            <hr className="bg-gray-200 h-0.5" />
                            <div className="flex flex-row justify-between">
                                <p className="text-gray-600">Total</p>
                                <div>
                                    <p className="text-end font-bold">$103.88</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="transition-colors text-sm bg-blue-600 hover:bg-blue-700 p-2 rounded-sm w-full text-white shadow-md">
                                    FINISH
                                </button>
                                <button className="transition-colors text-sm bg-white border border-gray-600 p-2 rounded-sm w-full text-gray-700 shadow-md">
                                    ADD MORE PRODUCTS
                                </button>
                            </div>
                        </div> */}
                        <Outlet />
                    </div>
                </div>
            </main>


            {/* Modal controlado por Zustand */}
            {isModalOpen && <ShowServicioClient />}

        </>
    )
}

export default PageServicio