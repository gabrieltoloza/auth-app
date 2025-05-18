import mongoose from "mongoose";
import { handleCreateMongoError } from "../../utils/handler.mongo.error.js";
import { ProductService } from "../products/index.js";
import { BuyerDao } from "../../dao/buyer.dao.js";
import { OrderService } from "../order/index.js";
import { nanoid } from "nanoid";


export class CartRepository {

    constructor(dao) {
        this.dao = dao
    }


    async getCarts(){
        try {
            
            const carts = await this.dao.getCarts()

            if(!carts.length) return new Error("No hay carritos en la base de datos")

            return carts

        } catch (error) {
            return error
        }
    }

    
    async getById(id) {

        try {

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return new Error("Id carrito invalido");
            }

            const result = await this.dao.getById(id)

            if(!result) return new Error("Error al intentar obtener el carrito")

            return result 

        } catch (error) {
            console.log(error.message);
            return error;
        }
    }


    async getByBuyerId(id) {

        try {

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return new Error("Id carrito invalido");
            }
            
            const result = await this.dao.getByBuyerId(id)

            if(!result) return new Error("No se pudo encontrar su carrito")

            return result

        } catch (error) {
            console.log(error.message);
            return error;
        }
    }


    async createCart(bid, products) {
        try {
            
            let totalAmount = 0

            const checkUser = await BuyerDao.getById(bid)

            if (checkUser instanceof Error || !mongoose.Types.ObjectId.isValid(bid)) {
                return new Error("Id carrito invalido o usuario no encontrado");
            }

            for(const product of products) {
                const productId = product.product;
                if (!mongoose.Types.ObjectId.isValid(productId) || product.quantity < 1) {
                    return new Error("Id carrito invalido o cantidad 0");
                }
                const checkProduct = await ProductService.getProductById(productId)
                if(!checkProduct || checkProduct instanceof Error ) {
                    return new Error("No se encontro el producto que intenta agregar al carrito")
                }

                totalAmount += checkProduct.price * product.quantity
            }
            
            const idAndProducts = {
                buyer: bid,
                products: products // <-- Array de objetos ( product_id, quantity )
            }

            // Datos iniciales al crearse un carrito
            const OrderData = {
                code: nanoid(),
                buyer: bid,
                totalPrice: totalAmount
            }

            const initialOrder = await OrderService.createOrder(OrderData)

            const result = await this.dao.createCart(idAndProducts)

            return result

        } catch (error) {
            console.log(error.message)
            return handleCreateMongoError(error)
        }
    }


    async updateCart(id, product) {
        try {

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return new Error("Id carrito invalido");
            }

            if (typeof product !== 'object' || product.quantity < 1) {
                return new Error("Cantidad invalida");
            }

            const cart = await this.dao.getById(id)

            if(!cart) return new Error("Error al intentar obtener el carrito desde 'updateCart'")


            const productIndex = cart.products.findIndex(p => p.product._id.toString() === product.product);
            if(productIndex === -1) return new Error("Producto no encontrado en el carrito")

            cart.products[productIndex].quantity = product.quantity;

            const result = await this.dao.updateCart(id, { products: cart.products })

            if(!result) return new Error("Error al actualizar el carrito")

            return result

        } catch (error) {
            console.log(error.message);
            return error;
        }
    }


    async updateCartByBuyerId(id, products) {
        try {
            console.log(products)
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return new Error("Id carrito invalido");
            }

            const result = await this.dao.updateCartByBuyerId(id, products)

            if(!result) return new Error("No se pudo actualizar el carrito por id comprador")

            return result

        } catch (error) {
            console.log(error.message);
            return error;
        }
    }


    
    async deleteCart(id) {
        try {

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return new Error("Id carrito invalido");
            }
            
            const result = await this.dao.deleteCart(id)

            if(!result) return new Error("Error al intentar eliminar el carrito")

            return result

        } catch (error) {
            console.log(error.message)
            return error
        }
    }


    async deleteCartByIdBuyer(id) {
        try {

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return new Error("Id carrito invalido");
            }
            
            const result = await this.dao.findOneAndDelete(id)

            if(!result) return new Error("Error al eliminar el carrito por id del comprador ")

            return result

        } catch (error) {
            console.log(error.message)
            return error
        }
    }
}