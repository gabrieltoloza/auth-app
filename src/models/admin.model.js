import mongoose from "mongoose"
import {config} from "../utils/utilities.js"

mongoose.pluralize(null)

const collectionSchema = config.MONGO_ADMIN_COLECTION

const collectionRef = config.MONGO_ORDER_COLECTION

const adminSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: [ String ], required: true},
    orders: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: collectionRef
        }
    ]
})

export default mongoose.model(collectionSchema, adminSchema)
