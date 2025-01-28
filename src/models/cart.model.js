import mongoose from "mongoose";
import { config } from "../utils/utilities.js";



const collectionSchema = config.MONGO_CART_COLECTION;


const collectionProductRef = config.MONGO_PRODUCT_COLECTION;
const collectionBuyerRef = config.MONGO_BUYER_COLECTION


const cartSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: collectionBuyerRef,
        required: true
    },
    products: [ 
        {
            product: { type: mongoose.Schema.Types.ObjectId , ref: collectionProductRef, required: true},
            quantity: { type: Number, required: true, min: 1 }
        }
    ]
})



export default mongoose.model(collectionSchema, cartSchema)