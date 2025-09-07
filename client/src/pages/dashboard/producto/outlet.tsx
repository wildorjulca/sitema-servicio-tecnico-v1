// components/ProductLayout.tsx
import { Outlet } from "react-router-dom";

export function ProductLayout() {
  return (
    <div>
      {/* Header o navegación común para productos */}
      <Outlet /> {/* Aquí se renderizarán Producto o DetalleProducto */}
    </div>
  );
}