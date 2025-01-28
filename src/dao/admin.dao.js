import mongoose from 'mongoose'
import AdminModel from '../models/admin.model.js'
import { handleCreateMongoError } from '../utils/handler.mongo.error.js'


export class AdminDao {

    static async getByEmail (email) {
        try {

            const result = await AdminModel.findOne({ email })

            return result

        } catch (error) {
            console.log(error)
            return error
        }
    }

    static async createAdmin (admin) {
        try {

            const result = await AdminModel.create(admin)

            return result

        } catch (error) {
            console.log(error.message)
            return handleCreateMongoError(error)
        }
    }

    static async updateAdmin(id, admin) {
        try {

            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error("Id del admin invalido");
            }

            const result = await AdminModel.updateOne({ _id: id }, { $set: admin });

            if(result.modifiedCount < 1) throw new Error("Error de base de datos al actualizar administrador");

            return result

        } catch (error) {
            console.error("Error al actualizar administrador:", error.message);
            return error
        }
    }
}