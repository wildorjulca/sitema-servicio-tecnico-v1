import { instance } from "@/lib/axios"
import { clienteSchema } from "@/lib/zods"
import { z } from "zod"


export const createCliente = async (values: z.infer<typeof clienteSchema>) => {
    try {
        const response = await instance.post("http://localhost:3001/api/servicio/addCliente", values)
        if (response.status === 201) {
            return { succes: true, status: 201, data: response.data }
        }
    } catch (error) {
        console.log(error)
    }
}

// Interfaz genérica para manejar ambos casos
interface FetchResponse {
    succes: boolean; // Nota: corregido de 'succes' a 'success' para consistencia.
    status: number;
    data: ClientTypes[];
    error?: any | undefined
}
export const fetchCliente = async (): Promise<FetchResponse> => {
    try {
        const response = await instance.get("/getAllCliente")
        if (response.data.data.length > 0) {
            return { succes: true, status: 200, data: response.data.data}
        } else {
            return { succes: true, status: 200, data: [] }

        }
    } catch (error) {
        console.log(error)
        return { succes: false, status: 500, data: [] , error: error}; // Retorna un objeto consistente.
    }
}