import { CartService } from "../services/cart/index.js";
import { OrderService } from "../services/order/index.js";


export class CartController {


    static async getCarts(req, res) {

        try {
            
            const result = await CartService.getCarts()
            if(result instanceof Error) return res.status(400).json({ status: false, error: result.message })

            res.status(200).json({ status: true, result: result })

        } catch (error) {
            res.status(500).json({ status: false, error: error.message })
        }
    }

    static async getById(req, res) {

        const { cid } = req.params

        try {

            const result = await CartService.getById(cid)

            if(result instanceof Error) return res.status(400).json({ status: false, error: result.message })

            res.status(200).json({ status: true, result: result })

        } catch (error) {
            console.log(error.message);
            res.status(500).json({ status: false, error: error.message })
        }
    }


    static async createCart(req, res) {

        const { bid } = req.params
        const { products } = req.body // <-- Debe ser un array de objetos

        try {

            const result = await CartService.createCart(bid, products)

            if(result instanceof Error) return res.status(400).json({ status: false, error: result.message })

            res.status(200).json({ status: true, result: result })

        } catch (error) {
            console.log(error.message)
            res.status(500).json({ status: false, error: error.message })
        }
    }

    static async updateCart(req, res) {

        const { cid } = req.params
        const  product  = req.body

        try {

            const result = await CartService.updateCart(cid, product)

            if(result instanceof Error) return res.status(400).json({ status: false, error: result.message })

            res.status(200).json({ status: true, result: result })

        } catch (error) {
            console.log(error.message);
            res.status(500).json({ status: false, error: error.message })
        }
    }


    static async deleteCart(req, res) {

        const { cid } = req.params

        try {
            
            const result = await CartService.deleteCart(cid)

            if(result instanceof Error) return res.status(400).json({ status: false, error: result.message})

            res.status(200).json({ status: true, result: result})

        } catch (error) {
            console.log(error.message)
            res.status(500).json({ status: false, error: error.message})
        }
    }

    static async resolve (req, res) {

        const { bid } = req.params
        const { status } = req.body
        console.log(status)
        try {
            
            const result = await OrderService.resolveOrder(bid, status)

            if(result instanceof Error) return res.status(400).json({ status: false, error: result.message})

            res.status(200).json({ status: true, result: result})

        } catch (error) {
            console.log(error.message)
            res.status(500).json({ status: false, error: error.message})
        }
    }
}