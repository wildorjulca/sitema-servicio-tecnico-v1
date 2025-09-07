import React, { Suspense, useState, useEffect } from "react";
import img from './teclado.jpg'
// Simulación de carga de datos con una promesa
const loadInvoices = () =>
    new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    invoice: "INV001",
                    paymentStatus: "Paid",
                    totalAmount: "$250.00",
                    paymentMethod: "Credit Card",
                },
                {
                    invoice: "INV002",
                    paymentStatus: "Pending",
                    totalAmount: "$150.00",
                    paymentMethod: "PayPal",
                },
                {
                    invoice: "INV003",
                    paymentStatus: "Unpaid",
                    totalAmount: "$350.00",
                    paymentMethod: "Bank Transfer",
                },
                {
                    invoice: "INV004",
                    paymentStatus: "Paid",
                    totalAmount: "$450.00",
                    paymentMethod: "Credit Card",
                },
                {
                    invoice: "INV005",
                    paymentStatus: "Paid",
                    totalAmount: "$550.00",
                    paymentMethod: "PayPal",
                },
                {
                    invoice: "INV006",
                    paymentStatus: "Pending",
                    totalAmount: "$200.00",
                    paymentMethod: "Bank Transfer",
                },
                {
                    invoice: "INV007",
                    paymentStatus: "Unpaid",
                    totalAmount: "$300.00",
                    paymentMethod: "Credit Card",
                },
            ]);
        }, 2000); // Simula un retraso de 2 segundos
    });

const InvoiceTable = () => {
    const [invoices, setInvoices] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await loadInvoices();
            setInvoices(data);
        };
        fetchData();
    }, []);

    if (!invoices) {
        // Muestra un indicador de carga mientras se obtienen los datos
        return <div>Cargando...</div>;
    }

    return (
        <>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Name
                            </th>
                       
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Precio
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {Array(4).fill(null).map((_, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img
                                                className="h-10 w-10 rounded-full"
                                                src="https://i.pravatar.cc/150?img=1"
                                                alt="Avatar"
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                Jane Cooper
                                            </div>
                                            <div className="text-sm text-gray-500">jane.cooper@example.com</div>
                                        </div>
                                    </div>
                                </td>
                               
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-blue-900 font-semibold bg-blue-100 px-2 rounded-full">
                                        23.00
                                    </span>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </>
    );
};

// Componente principal
const TableProducts = () => {
    return (
        <div className="p-4">
            <Suspense fallback={<div className="text-center">Cargando componente...</div>}>
                <InvoiceTable />
            </Suspense>
        </div>
    );
};

export default TableProducts;
