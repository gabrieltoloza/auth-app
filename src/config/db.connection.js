import mongoose from "mongoose"
import {config} from "../utils/utilities.js"

export default class DbConnection {
    static #instance

    constructor() {
        mongoose.connect(config.MONGO_URI)
    }

    static getInstance = async () => {
        try {
            if (this.#instance) {
                console.log("Ya se ha iniciado una instancia de MongoDB")
                return this.#instance
            }
            this.#instance = new DbConnection()
            console.log("Conexion a MongoDB exitosa")
            return this.#instance
        } catch (error) {
            console.log("Error: ", error)
        }
    }
}
