import mongoose from "mongoose";
import { handleCreateMongoError } from "../../utils/handler.mongo.error.js";


export class ProductRepository {

    constructor (dao) {
        this.dao = dao;
    }


    async getAllProducts() {
        try {

            const result = await this.dao.getAllProducts();

            if(result.length < 1 || result instanceof Error) return new Error("Error al buscar todos los productos")

            return result
            
        } catch (error) {
            console.log(error.message);
            return error;
        }
    }

    async getProductById(id) {
        try {

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return new Error("Id orden invalido");
            }
            
            const result = await this.dao.getProductById(id);
            
            if(!result) return new Error("Error al buscar producto por Id")
        
            return result

        } catch (error) {
            console.error(error.message);
            return error;
        }
    }

    async createProduct (order) {
        try {

            const result = await this.dao.createProduct(order)
        
            return result

        } catch (error) {
            console.log(error.message)
            return handleCreateMongoError(error)
        }
    }

    
    async updateProduct(id, data) {
        try {

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return new Error("Id orden invalido");
            }
            
            const result = await this.dao.updateProduct(id, data);

            if(!result) return new Error("Error al ACTUALIZAR producto por Id")

            return result

        } catch (error) {
            console.log(error.message);
            return error;
        }
    }


    async deleteProduct (id) {
        try {

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return new Error("Id orden invalido");
            }

            const result = await this.dao.deleteProduct(id)

            if(!result) return new Error("Error al crear un nuevo producto")
        
            return result

        } catch (error) {
            console.log(error.message)
            return error
        }
    }

}