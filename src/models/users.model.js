import mongoose from "mongoose";
import { config } from "../utils/utilities.js";



// funcion para que no haga plural el nombre de la coleccion.
mongoose.pluralize(null);


const collection = config.MONGO_USERS_COLECTION


const UserSchema = new mongoose.Schema({
    seller_name: { type: String, required: true, unique: true },
    code_list: { type: String, required: true, unique: true},
    password: { type: String, required: true },
    email: { type: String, default: '' },
    order: { type: [ Number ] , default: [] },
    role: { type: [ String ], default: ['seller'] },
    bearer_token: { type: String , default: config.BEARER_TOKEN },
})



const model =  mongoose.model(collection, UserSchema);



export default model;