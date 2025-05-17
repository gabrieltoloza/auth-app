import {customLogger} from "../utils/loggers.js"
import {request, response} from "express"

// Parametros tipados para express con .js
export const addLogger = (req = request, res = response, next) => {
    req.logger = customLogger
    customLogger.info(`${req.method} en ${req.url} - ${Date().toLocaleString()}`)
    next()
}
