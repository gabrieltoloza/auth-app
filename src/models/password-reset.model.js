import mongoose from "mongoose";
import { config } from "../utils/utilities.js";


mongoose.pluralize(null);


const collectionSchema = config.MONGO_PASSWORD_RESET_COLLECTION;

const passwordResetSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    resetToken: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


// Configura el índice TTL para eliminar el documento después de 15 minutos
passwordResetSchema.index({ createdAt: 1 }, { expireAfterSeconds: 900 }); // 15 minutos = 900 segundos

export default mongoose.model(collectionSchema, passwordResetSchema);
