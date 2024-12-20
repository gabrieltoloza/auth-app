import dotenv from 'dotenv';

// Cargamos variables de entorno
dotenv.config();



// Constante de configuraciones globales:
export const config = {
    
    MONGO_CARTS_COLECTION: 'products',
    MONGO_USERS_COLECTION: 'users',

    // .env
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT,
    SECRET_JWT: process.env.SECRET_JWT,
    BEARER_TOKEN: process.env.BEARER_TOKEN
    
}