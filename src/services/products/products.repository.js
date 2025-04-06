import mongoose from "mongoose"
import {handleCreateMongoError} from "../../utils/handler.mongo.error.js"

export class ProductRepository {
    constructor(dao) {
        this.dao = dao
    }

    async getAllProducts() {
        try {
            const result = await this.dao.getAllProducts()

            if (result.length < 1 || result instanceof Error) return new Error("Error al buscar todos los productos")

            return result
        } catch (error) {
            console.log(error.message)
            return error
        }
    }

    async getProductById(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return new Error("Id orden invalido")
            }

            const result = await this.dao.getProductById(id)

            if (!result) return new Error("Error al buscar producto por Id")

            return result
        } catch (error) {
            console.error(error.message)
            return error
        }
    }

    async createProduct(order) {
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
                return new Error("Id orden invalido")
            }

            const result = await this.dao.updateProduct(id, data)

            if (!result) return new Error("Error al ACTUALIZAR producto por Id")

            return result
        } catch (error) {
            console.log(error.message)
            return error
        }
    }

    async deleteProduct(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return new Error("Id orden invalido")
            }

            const result = await this.dao.deleteProduct(id)

            if (!result) return new Error("Error al crear un nuevo producto")

            return result
        } catch (error) {
            console.log(error.message)
            return error
        }
    }

    async insertManyProducts(arrayModelObject) {
        try {
            const result = await this.dao.insertManyProducts(arrayModelObject, {ordered: false})

            // Si result es un array (éxito de Mongoose)
            if (Array.isArray(result)) {
                return {
                    success: true,
                    insertedCount: result.length,
                    insertedIds: result.map(doc => doc._id)
                }
            }

            // Si result no es un array pero tiene propiedades de MongoDB nativo
            if (result.insertedCount !== undefined) {
                return {
                    success: true,
                    insertedCount: result.insertedCount,
                    insertedIds: result.insertedIds
                }
            }

            // Si el resultado no es reconocible
            return {
                success: false,
                error: "UNKNOWN_RESULT",
                message: "Formato de respuesta desconocido"
            }
        } catch (error) {
            //! CREAR ERROR HANDLER A PARTIR DE ESTE CATCH
            //! CREAR ERROR HANDLER A PARTIR DE ESTE CATCH
            // caso de insercion parcial
            if (error.result && typeof error.result.nInserted === "number") {
                return {
                    success: "partial",
                    inserted: error.result.nInserted,
                    total: arrayModelObject.length,
                    failed: arrayModelObject.length - error.result.nInserted,
                    errors: error.writeErrors?.map(err => ({
                        index: err.index,
                        document: arrayModelObject[err.index],
                        code: err.code,
                        message: err.errmsg
                    }))
                }
            }

            // Error de duplicación
            if (error.code === 11000) {
                return {
                    success: false,
                    error: "DUPLICATE_KEY",
                    message: "Documentos duplicados detectados",
                    details: error.writeErrors || error.message
                }
            }

            // Error de validación
            if (error.name === "ValidationError") {
                return {
                    success: false,
                    error: "VALIDATION_ERROR",
                    message: "Uno o más documentos no cumplen con el esquema",
                    details: error.errors
                }
            }

            return {
                success: false,
                error: error.name || "UNKNOWN_ERROR",
                message: error.message
            }
        }
    }
}
