import React, { Suspense, useState, useEffect } from "react";

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
        <table className="w-full border-collapse border border-gray-300">
            <caption className="text-lg font-bold mb-2">A list of your recent invoices</caption>
            <thead>
                <tr>
                    <th className="border border-gray-300 px-4 py-2">Invoice</th>
                    <th className="border border-gray-300 px-4 py-2">Status</th>
                    <th className="border border-gray-300 px-4 py-2">Method</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Amount</th>
                </tr>
            </thead>
            <tbody>
                {invoices.map((invoice) => (
                    <tr key={invoice.invoice}>
                        <td className="border border-gray-300 px-4 py-2">{invoice.invoice}</td>
                        <td className="border border-gray-300 px-4 py-2">{invoice.paymentStatus}</td>
                        <td className="border border-gray-300 px-4 py-2">{invoice.paymentMethod}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">{invoice.totalAmount}</td>
                    </tr>
                ))}
            </tbody>
            <tfoot>
                <tr>
                    <td className="border border-gray-300 px-4 py-2" colSpan={3}>
                        Total
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">$2,500.00</td>
                </tr>
            </tfoot>
        </table>
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
