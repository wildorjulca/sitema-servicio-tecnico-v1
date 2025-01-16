import { Request, Response } from "express"
import { newProductoService } from "../service/productoService"





const addProductCTRL = async (req: Request, res: Response) => {
    // const response = await newProductoService()
    // if (req.files) {
    //     console.log(req.files);
    // } else {
    //     console.log("No files uploaded.");
    // }
    
    res.send("pado")

}


export { addProductCTRL }