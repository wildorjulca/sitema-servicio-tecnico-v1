import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ClienteTypes } from "@/interface"
import { fetchCliente } from "@/services/clienteService"
import { useEffect, useState } from "react"

const TableCliente = () => {
    const [dataCliente, setdataCliente] = useState([])

    useEffect(() => {
        const getCliente = async () => {
            const response = await fetchCliente()
            setdataCliente(response?.data)
        }
        getCliente()
    }, [])

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="">Cliente</TableHead>
                        <TableHead>Tipo Documento</TableHead>
                        <TableHead>Documento</TableHead>
                        <TableHead className="">Direccion</TableHead>
                        <TableHead className="">Telefono</TableHead>
                        <TableHead className="">Acciones</TableHead>

                    </TableRow>
                </TableHeader>
                <TableBody>
                    {dataCliente.map((item: ClienteTypes) => (
                        <TableRow key={item.idCliente}>
                            <TableCell>{item.nombre}</TableCell>
                            <TableCell>{item.TIPO_DOCUMENTO_cod_tipo}</TableCell>
                            <TableCell>{item.numero_documento}</TableCell>
                            <TableCell>{item.direccion}</TableCell>
                            <TableCell className="">
                                {item.telefono}
                            </TableCell>
                            <TableCell className="">
                                <button>Eliminar</button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={3}>Total</TableCell>
                        <TableCell className="text-right">$2,500.00</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>

        </div>
    )
}

export default TableCliente
