import cors from 'cors'


// Array que contiene los origins permitidos para definir en CORS
const ACCEPTED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173'
]


export const corsMiddleware = ({acceptedOrigins = ACCEPTED_ORIGINS} = {}) => cors({

    origin: (origin, callback) => {
        
        if (acceptedOrigins.includes(origin)) {
            return callback(null, true)
        }

        if (!origin) {
            return callback(null, true)
        }

        return callback(new Error('Solicitud no permitida por CORS'), false)
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
})