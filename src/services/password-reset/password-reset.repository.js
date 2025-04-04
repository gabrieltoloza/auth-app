import mongoose from "mongoose";
import { nanoid } from "nanoid";
import { transport } from "../../config/transporter.js";
import dirname from '../../utils/dirname.js'
import { handleCreateMongoError } from "../../utils/handler.mongo.error.js";
import { createHash } from "../../utils/funcionesHash.js";
import buyerModel from "../../models/buyer.model.js";



export class PasswordResetRepository {

    constructor(dao) {
        this.dao = dao
    }

    async createPasswordReset(email) {

        const user = {
            email: email,
            resetToken: nanoid()
        }

        try {

            const result = await this.dao.createPasswordReset(user);
            await transport.sendMail({
                from: process.env.GOOGLE_EMAIL,
                to: result.email,
                subject: 'Actualizar contraseña',
                html:`
                    <div>
                        <h1> En este mail va el link del formulario para cambiar la contraseña </h1>
                        <img src="cid:picklog">
                    </div>
                `,
                attachments: [{
                    filename: 'logo_pick&log.png',
                    path: dirname+'/public/img/logo_pick&log.png',
                    cid: 'picklog'
                }]
            })
             
             return result

        } catch (error) {
            console.log(error.message)
            return handleCreateMongoError(error)
        }
    }


    async updatePassword(email, resetToken, password) {
        
        try {

            const passwordHash = createHash(password);  // Asegúrate de tener la función createHash implementada correctamente
            
            // Buscar el documento con el email
            const response = await this.dao.getByEmail(email)
            
            if (!response) return new Error("Usuario no encontrado")
    
            // Verificar si el resetToken es válido y no ha expirado
            if (response.resetToken !== resetToken) return new Error("resetToken Invalido")

    
            // Asegúrate de que el token no haya expirado (si estás utilizando TTL)
            if (new Date() - new Date(response.createdAt) > 900000) return new Error("Reset token has expired")  // 900000 ms = 15 minutos


            const user = {
                password: passwordHash
            };
    

            // Actualizar la contraseña del usuario en buyerModel
            const updateUser = await buyerModel.updateOne({ email }, { $set: user })
       
            return updateUser;

            
        } catch (error) {
            console.log(error.message)
            return error
        }
    }
}