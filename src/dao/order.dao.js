import mongoose from "mongoose";
import OrderModel from '../models/order.model.js'
import { handleCreateMongoError } from "../utils/handler.mongo.error.js";



export class OrderDao {

    static async getAllOrders() {
        try {

            const result = await OrderModel.find()
                                            .lean();

            return result

        } catch (error) {
            console.log(error.message)
            return error
        }
    }

    static async getOrderById (id) {
        try {
            
            const result = await OrderModel.findOne({ _id: id })
                
            return result

        } catch (error) {
            console.log(error.message)
            if(error instanceof mongoose.Error.ValidationError) {
                return { error: "Validation Error Mongo: " + error.message }
            } else {
                return error
            }
        }
    }

    static async getOrderByIdBuyer(idBuyer) {
        try {

            const result = await OrderModel.findOne({ buyer: idBuyer })

            return result

        } catch (error) {
            console.log(error.message)
            return error
        }
    }


    static async createOrder (order) {
        try {

            const result = await OrderModel.create(order)
        
            return result

        } catch (error) {
            console.log(error.message)
            return handleCreateMongoError(error)
        }
    }

    
    static async resolveOrder (id, status) {
        try {

            const result = await OrderModel.findOneAndUpdate({ buyer: id }, { $set: status }, { new: true })
            
            return result

        } catch (error) {
            console.log(error)
            return error
        }
    }

    static async deleteOrder(id) {
        try {

            const result = await OrderModel.findByIdAndDelete(id)

            return result

        } catch (error) {
            console.log(error.message)
            return error
        }
    }

    async deleteOrderByIdBuyer(idBuyer) {
        try {

            const result = await OrderModel.findOneAndDelete({ buyer: idBuyer })

            return result

        } catch (error) {
            console.log(error.message)
            return error
        }
    }
}