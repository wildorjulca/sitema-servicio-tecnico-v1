import { useUser } from "@/hooks/useUser";
import { ProductDialog } from "./ui/modal"
import { DataTableDemo } from "./ui/table"

const Producto = () => {
      const { user } = useUser();
      const usuarioId = user?.id;
    return (
        <div>
            <DataTableDemo usuarioId={usuarioId}/>

            <ProductDialog />
        </div>
    )
}

export default Producto
