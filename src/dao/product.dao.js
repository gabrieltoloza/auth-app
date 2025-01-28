import mongoose from "mongoose";
import ProductModel from "../models/products.model.js"
import { handleCreateMongoError } from "../utils/handler.mongo.error.js";


export class ProductDao {

    static async getAllProducts() {
        try {

            const result = await ProductModel.find();

            return result
            
        } catch (error) {
            console.log(error.message);
            return error;
        }
    }

    static async getProductById(id) {

        try {

            const result = await ProductModel.findById(id);
        
            return result

        } catch (error) {
            console.error(error.message);
            return error;
        }
    }

    static async createProduct (order) {
        try {

            const result = await ProductModel.create(order)
        
            return result

        } catch (error) {
            console.log(error.message)
            return error
        }
    }

    
    static async updateProduct(id, data) {
        try {
            
            const result = await ProductModel.findOneAndUpdate(
                { _id: id }, 
                { $set: data },
                { new: true }
            );

            return result

        } catch (error) {
            console.log(error.message);
            return error;
        }
    }


    static async deleteProduct (id) {
        try {

            const result = await ProductModel.findByIdAndDelete(id)
        
            return result

        } catch (error) {
            console.log(error.message)
            return error
        }
    }
}