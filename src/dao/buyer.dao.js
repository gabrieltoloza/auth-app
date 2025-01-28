import mongoose from "mongoose";
import BuyerModel from '../models/buyer.model.js'
import { handleCreateMongoError } from "../utils/handler.mongo.error.js";


export class BuyerDao {

    static async getAllBuyers () {
        try {

            const result = await BuyerModel.find()

            if(result.length < 1) return new Error("Error al buscar compradores")

            return result

        } catch (error) {
            console.log(error.message)
            return error;
        }
    }

    static async getById (id) {
        try {

            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error("Id comprador invalido");
            }

            const result = await BuyerModel.findById(id)

            if(!result) return new Error("Error al buscar compradores por Id")

            return result 

        } catch (error) {
            console.log(error.message)
            return error
        }
    }

    static async getByEmail (email) {
        try {

            const result = await BuyerModel.findOne({ email })

            return result

        } catch (error) {
            console.log(error.message)
            return error
        }
    }


    static async createBuyer (buyer) {
        try {

            const result = await BuyerModel.create(buyer)

            return result

        } catch (error) {
            console.log(error.message)
            return handleCreateMongoError(error)
        }
    }

    static async updateBuyer (id, buyer) {
        try {

            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error("Id comprador invalido");
            }

            const result = await BuyerModel.updateOne({ _id: id }, { $set: buyer })

            if(result.modifiedCount < 1) return new Error("Error al actualizar comprador")

            return result

        } catch (error) {
            console.log(error.message)
            return error
        }
    }
}