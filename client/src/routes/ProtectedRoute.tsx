// src/components/ProtectedRoute.tsx
import { useUser } from "@/hooks/useUser";
import { Navigate } from "react-router-dom";

interface Props {
  children: JSX.Element;
}
const ProtectedRoute = ({ children }: Props) => {

  const { user, loading } = useUser();

  if (loading) {
    return <div>Cargando...</div>; // o un spinner bonito
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
  export default ProtectedRoute;
