import mongoose from "mongoose";
import { config } from "../utils/utilities.js";

mongoose.pluralize(null);


const collection = config.MONGO_CARTS_COLECTION;


const schema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String , required: true },
    thumbnails: { type: [{ type: String }], },
    status: { type: Boolean, required: true }
})



const model = mongoose.model(collection, schema)


export default model;