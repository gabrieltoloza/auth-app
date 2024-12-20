import { Router } from "express";
import { authorization } from "../middleware/authorization.js";
import { passportCall } from "../utils/passportCall.js";
import ProductsModel from '../models/products.model.js'


const router = Router();


router.get('/', (req, res) => {

    res.status(200).json({ message: "Bienvenido a TomadorWeb S.A"})
})


// Usuario permitido para "seller(por ende tambien un admin)"
router.get('/viewProducts', passportCall('jwt'), authorization('seller'), async(req, res) => {

    try {
        
        const products = await ProductsModel.find()
        if(!products) res.status(400).json({ message: "Error al traer a los productos" })

        res.status(200).json(products)

    } catch (error) {
        res.status(500).json({ error: error.message})

    }

})


// Endpoint de prueba para usuario "admin"
router.post('/newProduct', passportCall('jwt'), authorization('admin'), async(req, res) => {

    try {
        
        const {
            title, 
            description, 
            code, 
            price, 
            stock, 
            category, 
            thumbnails, 
            status
        } = req.body;

        if(!title && !description && !code && !price && !stock && !category && !thumbnails && !status) {
            res.status(400).json({ message: "Error al crear un nuevo producto" })
        }

        const newProduct = {
            title: title,
            description: description,
            code: code,
            price: price,
            stock: stock,
            category: category,
            thumbnails: thumbnails,
            status: status
        }

        const result = await ProductsModel.create(newProduct);
        if(result instanceof Error) res.status(400).json({ message: result.message })
        
        res.status(200).json(result)

    } catch (error) {
        res.status(500).json({ error: error.message})
    }

})



export default router;