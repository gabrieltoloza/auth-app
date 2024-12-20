import express from 'express'
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import initializePassport from './src/config/passport.config.js';
import passport from 'passport';
import UserRouter from './src/routes/users.js';
import ProductsRouter from './src/routes/products.js'
import { config } from './src/utils/utilities.js';




const app = express();


// Configuramos express para que acepte json y la libreria cookieParser
app.use(express.json());
app.use(cookieParser());

// Inicializamos passport 
initializePassport();
app.use(passport.initialize());


// Definiedo el uso de los routers
app.use('/api/products', ProductsRouter);
app.use('/api/sessions', UserRouter);




// Conectando mongo para que este disponible en nuestra app.
mongoose.connect(config.MONGO_URI)
    .then(() => {
        app.listen(config.PORT, () => {
            console.log(`Conexion a MongoDB exitosa. Puerto funcionando en el puerto http://localhost:${config.PORT}`)
        })
    })
    .catch(err => console.error('Error al conectar a MongoDB, no se pudo levantar el servidor: ', err))
