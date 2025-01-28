import mongoose from "mongoose";
import { nanoid } from 'nanoid'
import { handleCreateMongoError } from "../../utils/handler.mongo.error.js";
import { CartService } from "../cart/index.js";
import { ProductService } from "../products/index.js";


export class OrderRepository {

    constructor(dao) {
        this.dao = dao;
    }

    async getAllOrders() {
        try {

            const result = await this.dao.getAllOrders();

            if(!result.length) return new Error("No se encontraron ordenes en la base de datos")

            return result

        } catch (error) {
            console.log(error.message)
            return error
        }
    }


    static async getOrderById (id) {
        try {

            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error("Id orden invalido");
            }

            const result = await this.dao.getOrderById(id)

            if(!result) return new Error("Error al buscar orden por Id")
                
            return result

        } catch (error) {
            console.log(error.message)
            return error
        }
    }

    async getOrderByIdBuyer(idBuyer) {
        try {

            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error("Id orden invalido");
            }

            const result = await this.dao.getOrderByIdBuyer(idBuyer)

            if(!result) return new Error("Error al buscar orden por Id del comprador")

            return result

        } catch (error) {
            console.log(error.message)
            return error
        }
    }


    async createOrder (order) {
        try {

            const cleanitem = {
                ...order,
                code: nanoid()
            }

            const result = await this.dao.createOrder(cleanitem)

            return result

        } catch (error) {
            console.log(error.message)
            return handleCreateMongoError(error)
        }
    }


    async deleteOrder(id) {
        try {

            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error("Id orden invalido");
            }

            const result = await OrderModel.findByIdAndDelete(id)

            if(!result) return new Error("Error al intentar borrar la orden de compra")

            return result

        } catch (error) {
            console.log(error.message)
            return error
        }
    }


    async deleteOrderByIdBuyer(id) {
        try {

            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error("Id orden invalido");
            }

            const result = await this.dao.deleteOrderByIdBuyer(id)

            if(!result) return new Error("Error al intentar borrar la orden de compra")

            return result

        } catch (error) {
            console.log(error.message)
            return error
        }
    }


    async resolveOrder (id, status) {
        try {

            let finalPrice = 0
            let purchaseItems = []
            let notPurchasedItems = []
            

            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error("Id orden invalido");
            }

            const cart = await CartService.getByBuyerId(id)

            if(cart instanceof Error) return new Error("No se encontro Carrito desde OrderRepository")

            if(status === "cancelled") {
                console.log("Entra en 'cancelacion' de orden")
                const deleteCart = await CartService.deleteCartByIdBuyer(id)
                const deleteOrder = await this.deleteOrderByIdBuyer(id)

                if(!deleteCart || !deleteOrder) return new Error("No se pudieron eliminar los datos de compra 'orden o carrito' ")
                    
                return { status: "success", message: "Orden cancelada" };

            }

            if (status === "confirmed") {
                for(const item of cart.products) {
                    console.log("Entra en 'confirmacion' de orden")

                    const productId = item.product;

                    const checkProduct = await ProductService.getProductById(productId)

                    if(!checkProduct) return new Error("No se encontro el producto que intenta procesar para la compra")
    
                    if(item.quantity <= checkProduct.stock ){
                        const newStock = checkProduct.stock - item.quantity

                        const updateProduct = await ProductService.updateProduct(productId, { stock: newStock})
                        
                        if(!updateProduct) return new Error('Error al actualizar el producto despues de descontar el stock')

                        finalPrice += checkProduct.price * item.quantity
                        purchaseItems.push(item)
                    } else {
                        notPurchasedItems.push(item)
                    }
                }
            }



            // Nuevo objeto a partir de la confirmacion de la orden
            const updateOrder = {
                purchase_datetime: new Date(Date.now()).toLocaleString(),
                status: status,
                totalPrice: finalPrice,
            }



            const resultResolve = await this.dao.resolveOrder(id,updateOrder)
            if(!resultResolve) return new Error("Error al actualizar orden")

            const resultUpdateOrder = await CartService.updateCartByBuyerId(id, notPurchasedItems)
            
            if(!resultUpdateOrder ) return new Error("Error al actualizar carrito")

            return {
                status: "success",
                purchaseItems: purchaseItems,
                notPurchasedItems: notPurchasedItems,
                order: resultResolve
            }

        } catch (error) {
            console.log(error)
            return error
        }
    }


}