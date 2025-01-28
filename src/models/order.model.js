import mongoose from "mongoose"
import { config } from "../utils/utilities.js";


mongoose.pluralize(null);

const collectionSchema = config.MONGO_ORDER_COLECTION;

const collectionRefBuyers = config.MONGO_BUYER_COLECTION;
const collectionRefProducts = config.MONGO_PRODUCT_COLECTION;


const ordersSchema = new mongoose.Schema({
    code: { type: String, required: true }, // <-- Usar "nanoid"
    purchase_datetime: { type: String, default: ''},
    totalPrice: { type: Number, required: true , default: 0 },
    buyer:{ 
        type: mongoose.SchemaTypes.ObjectId, 
        ref: collectionRefBuyers
    },
    status: { 
        type: String, 
        enum: ["pending", "confirmed", "cancelled"], 
        default: "pending"
    }
})


export default mongoose.model(collectionSchema ,ordersSchema )

