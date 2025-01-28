import mongoose from "mongoose";

export function handleCreateMongoError(error) {
    if (error instanceof mongoose.Error.ValidationError) {
        return new Error(`Error de validacion Mongo: ${error.message}`)
    } else if (error instanceof mongoose.MongooseError && error.code === 11000) {
        return new Error(`Error de clave duplicada: ${error.message}`)
    } else if (error instanceof mongoose.Error.CastError) {
        return new Error(`Error de tipo de dato: ${error.message}`)
    } else {
        console.error('Error inesperado:', error.message);
        return new Error(`Error inesperado: ${error.message}`)
    }
}