import mongoose from "mongoose"
import AdminModel from "../models/admin.model.js"
import {handleCreateMongoError} from "../utils/handler.mongo.error.js"

export class AdminDao {
    static async getAdmins(limit = 1000, skip = 0) {
        try {
            const result = await AdminModel.find().skip(skip).limit(limit).lean()
            return result
        } catch (error) {
            return error
        }
    }

    static async getByEmail(email) {
        try {
            const result = await AdminModel.findOne({email})

            return result
        } catch (error) {
            return error
        }
    }

    static async createAdmin(admin) {
        try {
            const result = await AdminModel.create(admin)

            return result
        } catch (error) {
            return handleCreateMongoError(error)
        }
    }

    static async updateAdmin(id, admin) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error("Id del admin invalido")
            }

            const result = await AdminModel.updateOne({_id: id}, {$set: admin})

            if (result.modifiedCount < 1) throw new Error("Error de base de datos al actualizar administrador")

            return result
        } catch (error) {
            return error
        }
    }

    static async insertManyAdmins(arrayModelObject) {
        try {
            const result = await AdminModel.insertMany(arrayModelObject, {
                ordered: false,
                rawResult: true,
                lean: true
            })

            return result
        } catch (error) {
            if (error.writeErrors) {
                return {
                    insertedCount: error.insertedDocs?.length || 0,
                    errorCount: error.writeErrors.length,
                    code: error.code
                }
            }
            return error
        }
    }
}
