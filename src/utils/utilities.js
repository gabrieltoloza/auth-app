import dotenv from 'dotenv';

// Cargamos variables de entorno
dotenv.config();



// Constante de configuraciones globales:
export const config = {
    
    MONGO_ADMIN_COLECTION: 'admin',
    MONGO_BUYER_COLECTION: 'buyer',
    MONGO_ORDER_COLECTION: 'order',
    MONGO_CART_COLECTION: 'cart',
    MONGO_PRODUCT_COLECTION: 'product',
    MONGO_PASSWORD_RESET_COLLECTION: 'password-reset',
    MONGO_TICKET_COLLECTION: 'ticket',

    // .env
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT,
    SECRET_JWT: process.env.SECRET_JWT,
    
}