import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Error404 = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen dark:text-white text-gray-800">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-2xl mb-2">Oops! Página no encontrada</p>
            <p className="mb-6 text-gray-600">La página que buscas no existe o fue movida.</p>
            <Button asChild>
                <Link to="/dashboard">Volver al Dashboard</Link>
            </Button>
        </div>
    );
};

export default Error404;

