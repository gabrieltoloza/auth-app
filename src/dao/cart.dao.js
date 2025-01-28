import mongoose from "mongoose";
import CartModel from '../models/cart.model.js'
import BuyerModel from "../models/buyer.model.js"
import ProductModel from "../models/products.model.js"



export class CartDao {


    static async getCarts(){
        try {
            
            const carts = await CartModel.find()
                                            .populate({ path: 'buyer', model: BuyerModel })
                                            .populate({ path: 'products.product', model: ProductModel})
                                            .lean()
            return carts

        } catch (error) {
            return error
        }
    }

    
    static async getById(id) {

        try {

            const result = await CartModel.findById(id)                                            
                                            .populate({ path: 'buyer', model: BuyerModel })
                                            .populate({ path: 'products.product', model: ProductModel})
                                            .lean()

            return result 

        } catch (error) {
            console.log(error.message);
            return error;
        }
    }

    static async getByBuyerId(id) {

        try {

            const result = await CartModel.findOne({ buyer: id })

            return result 

        } catch (error) {
            console.log(error.message);
            return error;
        }
    }


    static async createCart(idAndProducts) {
        try {
            // el parametro products es un array de objetos ( product_id, quantity )
            const result = await CartModel.create(idAndProducts)


            return result

        } catch (error) {
            console.log(error.message)
            return error
        }
    }


    static async updateCart(id, quantity) {
        try {

            const result = await CartModel.findOneAndUpdate({ _id: id }, { $set: quantity }, { new: true} )
                                                .populate({ path: 'buyer', model: BuyerModel })
                                                .populate({ path: 'products.product', model: ProductModel})
                                                .lean()

            return result

        } catch (error) {
            console.log(error.message);
            return error;
        }
    }

    static async updateCartByBuyerId(id, products) {
        try {

            const result = await CartModel.findOneAndUpdate({ buyer: id }, { products: products }, { new: true })

            return result

        } catch (error) {
            console.log(error.message);
            return error;
        }
    }


    static async deleteCart(id) {
        try {
            
            const result = await CartModel.findOneAndDelete(id)

            return result

        } catch (error) {
            console.log(error.message)
            return error
        }
    }

    static async deleteCartByIdBuyer(id) {
        try {
            
            const result = await CartModel.findOneAndDelete({ buyer: id }, { new: true })

            return result

        } catch (error) {
            console.log(error.message)
            return error
        }
    }
}