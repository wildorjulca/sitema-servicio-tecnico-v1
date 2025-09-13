import Loader from "@/components/sniper-carga/loader";
import { useEstadoHook } from "@/hooks/useService";
import { useUser } from "@/hooks/useUser"
import { Estado } from "@/interface/types";
import { useEffect, useState } from "react";
import { DataTable } from "../ui/table-reutilizable";

export default function Estado_serv() {

    const { user } = useUser();
    const usuarioId = user?.id

    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setpageSize] = useState(10);
    const [totalRows, settotalRows] = useState(0)

    const { data, isLoading, isError, error, refetch } = useEstadoHook()
    useEffect(() => {
        if (usuarioId && data) {
            settotalRows(data.length);
            console.log("Datos de useTipoDocHook:", { data });
            refetch();
        }
    }, [pageIndex, pageSize, usuarioId, refetch]);

    if (!usuarioId) return <div>Por favor inicia sesión para ver los tipos de documento</div>;
    if (isLoading) return <div><Loader /></div>;
    if (isError) {
        console.error("Error details:", error);
        return (
            <div>
                Error al cargar los Tipos de estado del Servicio: {error?.message || "Unknown error"}
            </div>
        );
    }

    const mappedEstados = data.map((es: Estado) => ({
        id: es.idEstado,
        nombre: es.nombre,
        descripcion: es.descripcion,
    }));
    return (
            <div className="w-full">
              <DataTable
                data={mappedEstados}
                columns={[
                  { accessorKey: "id", header: "Código" },
                  { accessorKey: "nombre", header: "Tipo Estado" },
                  { accessorKey: "descripcion", header: "Descripcion del Estado" },
                ]}
                searchColumn="nombre"
                pageIndex={pageIndex}
                pageSize={pageSize}
                totalRows={totalRows}
                onPageChange={(newPage) => setPageIndex(newPage)}
                onPageSizeChange={(size) => setpageSize(size)}
              />
            </div>
    )
}
