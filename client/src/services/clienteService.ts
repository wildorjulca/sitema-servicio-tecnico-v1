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


export const fetchCliente = async () => {
    try {
        const response = await instance.get("/getAllCliente")
        if (response.data.data.length > 0) {
            return { succes: true, status: 200, data: response.data.data }
        }
    } catch (error) {
        console.log(error)
    }
}