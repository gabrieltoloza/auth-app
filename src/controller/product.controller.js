import { ProductService } from "../services/products/index.js";



export class ProductController {

    static async getAllProducts(req, res) {

        try {
        
            const products = await ProductService.getAllProducts()
            if(!products.length) res.status(400).json({ status: false, message: "Error al traer a los productos" })
    
            res.status(200).json(products)
    
        } catch (error) {
            res.status(500).json({ error: error.message})
    
        }
    }

    static async getProductById(req, res) {

        const { pid } = req.params;
        console.log(pid)

        try {
            const result = await ProductService.getProductById(pid)
            console.log(result)

            if (result instanceof Error ) return res.status(404).json({ status: false, message: result.message})

            return res.status(200).render('product-id', { status: true, product: parseResult })

        } catch (error) {
            res.status(500).json({ error: error.message})
        }

    }


    static async createProduct(req, res) {

        try {
        
            const {
                title, 
                description,
                price, 
                stock, 
                category
            } = req.body;
    
            if(!title && !description && !price && !stock && !category) {
                res.status(400).json({ message: "Error al crear un nuevo producto" })
            }
    
            const newProduct = {
                title: title,
                description: description,
                price: price,
                stock: stock,
                category: category
            }
    
            const result = await ProductService.createProduct(newProduct);
            if(result instanceof Error) res.status(400).json({ status: false, message: result.message })
            
            res.status(200).json({ status: true, result: result})
    
        } catch (error) {
            res.status(500).json({ error: error.message})
        }
    }

    static async updateProduct(req, res) {

        const { pid } = req.params;

        const body = req.body;
        
        try {
            
            const result = await ProductService.updateProduct( pid, body )
        
            if(result instanceof Error) return res.status(404).json({ status: false, message: result.message })
    
            return res.status(200).json({status: true, result: result})

        } catch (error) {
            res.status(500).json({ status: false , message: error.message})
        }

    }


    static async deleteProduct(req, res) {

        const { pid } = req.params
        console.log(pid)
        try {

            const result = await ProductService.deleteProduct(pid)

            if(result instanceof Error) return res.status(500).json({ status: false, message: result.message})
    
            return res.status(200).json({ status: true, result: result});

        } catch (error) {
            return res.status(500).json({ status: false, message: error.message})
        }

    }
}