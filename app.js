import express from "express"
import cookieParser from "cookie-parser"
import passport from "passport"
import compression from "compression"
import initializePassport from "./src/config/passport.config.js"
import UserRouter from "./src/routes/auth.routes.js"
import ProductsRouter from "./src/routes/products.routes.js"
import {config} from "./src/utils/utilities.js"
import {corsMiddleware} from "./src/middleware/cors.js"
import DbConnection from "./src/config/db.connection.js"
import CartRouter from "./src/routes/cart.routes.js"
import MockRouter from "./src/routes/mock.routes.js"
import {customLogger} from "./src/utils/loggers.js"
import {addLogger} from "./src/middleware/infoLogger.js"
import swaggerJSDoc from "swagger-jsdoc"
import swaggerUiExpress from "swagger-ui-express"
import {swaggerOptions} from "./src/documentacion/swagger.js"

const app = express()

// Configuraciones globales de express
app.use(compression())
app.use(express.json())
app.use(cookieParser())
app.use(corsMiddleware())
app.use(addLogger)
app.use("/public", express.static("public"))

// Inicializamos passport
initializePassport()
app.use(passport.initialize())

const spec = swaggerJSDoc(swaggerOptions)
app.use("/documentation", swaggerUiExpress.serve, swaggerUiExpress.setup(spec))

// Definiedo el uso de los routers
app.use("/api/products", ProductsRouter)
app.use("/api/sessions", UserRouter)
app.use("/api/carts", CartRouter)

// Ruta del Primer entregable
app.use("/api/mocks", MockRouter)

// Conectar a la base de datos antes de iniciar el servidor
DbConnection.getInstance()
    .then(() => {
        app.listen(config.PORT, () => {
            customLogger.info(`Conexion a MongoDB exitosa. Puerto funcionando en el puerto http://localhost:${config.PORT}`)
        })
    })
    .catch(err => {
        console.error("Error al conectar a MongoDB:", err)
    })
