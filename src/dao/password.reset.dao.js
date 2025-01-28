import PasswordResetModel from "../models/password-reset.model.js";



export class PasswordResetDao {

    static async createPasswordReset(obj){

        try {
            
            const result = await PasswordResetModel.create(obj)

            return result

        } catch (error) {
            console.log(error.message)
            return error
        }
    }

    static async getByEmail(email) {
        try {
            
            const result = await PasswordResetModel.findOne({ email: email})

            return result

        } catch (error) {
            console.log(error.message)
            return error
        }
    }

    static async updatePassword(email, password) {

        try {
            
            const result = await PasswordResetModel.updateOne({ email: email}, { $set: password})

            return result

        } catch (error) {
            console.log(error.message)
            return error
        }
    }
}