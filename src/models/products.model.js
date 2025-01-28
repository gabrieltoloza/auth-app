import mongoose from "mongoose";
import { config } from "../utils/utilities.js";

mongoose.pluralize(null);


const collectionSchema = config.MONGO_PRODUCT_COLECTION;


const schemaProduct = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true, trim: true},
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0},
    category: { type: String , required: true , trim: true},
    createdAt: { type: String, default: new Date(Date.now()).toLocaleString() }
})



const model = mongoose.model(collectionSchema, schemaProduct)


export default model;